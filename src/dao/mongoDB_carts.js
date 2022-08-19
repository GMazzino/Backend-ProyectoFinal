import { mongoose, cartsModel, productsModel } from '../models/mongoDB_schemas.js';
import { mongoRemote } from '../../config.js';
import logger from '../utils/logger.js';

class Carts {
  async #dbConnection() {
    try {
      await mongoose.connect(mongoRemote.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      mongoose.connection.on('error', (err) => {
        logger.error(`Module: dao/mongoDB_carts.js Method: #dbConnection (1) -> ${err}`);
        throw Error(err.message);
      });
      return mongoose.connection;
    } catch (err) {
      logger.error(`Module: dao/mongoDB_carts.js Method: #dbConnection (2) -> ${err}`);
      throw Error(err.message);
    }
  }

  // Creates empty cart
  async createCart(cartId) {
    try {
      const db = await this.#dbConnection();
      let newCart = await new cartsModel({
        id: cartId,
        products: [],
      }).save();
      await db.close();
      return { status: 200, content: newCart.products };
    } catch (err) {
      logger.error(`Module: dao/mongoDB_carts.js Method: createCart -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }

  async delCart(cartId) {
    const db = await this.#dbConnection();
    try {
      let del = await cartsModel.findOneAndDelete({ id: cartId });
      if (del !== null) {
        return {
          status: 200,
          content: { msg: `Carrito borrado` },
        };
      } else {
        return {
          status: 200,
          content: { msg: `Carrito con ID: ${cartId} no encontrado` },
        };
      }
    } catch (err) {
      logger.error(`Module: dao/mongoDB_carts.js Method: delCart -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }

  async getCartProducts(cartId) {
    try {
      const db = await this.#dbConnection();
      const cartContent = await cartsModel.findOne({ id: cartId });
      db.close();
      if (cartContent != null) {
        return {
          status: 200,
          content: cartContent.products,
        };
      } else {
        return await this.createCart(cartId);
      }
    } catch (err) {
      logger.error(`Module: dao/mongoDB_carts.js Method: getCartProducts -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }

  async addProductToCart(cartId, productId) {
    let cartContent = (await this.getCartProducts(cartId)).content;
    try {
      const db = await this.#dbConnection();
      // Verifying if the product exists in catalog
      let product = await productsModel.findOne({ id: productId });
      if (product != null) {
        if (cartContent == undefined) {
          // Empty cart
          cartContent = [{ id: productId, quantity: 1 }];
        } else {
          //  Verifying if the product already exists in cart
          let productIndex = cartContent.findIndex((prod) => prod.id == productId);
          if (productIndex == -1) {
            //New cart product
            cartContent.push({ id: productId, quantity: 1 });
          } else {
            //Existing cart product
            cartContent[productIndex].quantity += 1;
          }
        }
      } else {
        return {
          status: 200,
          content: { msg: `Producto no encontrado en el catálogo` },
        };
      }
      let result = await cartsModel.findOneAndUpdate({ id: cartId }, { products: cartContent });
      await db.close();
      if (result != null) {
        return {
          status: 200,
          content: { msg: `Producto con ID ${productId} agregado/actualizado en el carrito` },
        };
      } else {
        return {
          status: 400,
          content: { msg: `No se pudo guardar el producto.` },
        };
      }
    } catch (err) {
      logger.error(`Module: dao/mongoDB_carts.js Method: addProductToCart -> ${err}`);
      return { status: 500, content: { msg: `Server error: ${err.message}` } };
    }
  }

  async delProductFromCart(cartId, productId) {
    const db = await this.#dbConnection();
    let cart;
    try {
      if ((cart = await cartsModel.findOne({ id: cartId })) != null) {
        let cartProducts = cart.products;
        if (cart.products[0] !== undefined) {
          cartProducts = cartProducts.filter((prod) => prod.id !== productId);
        } else {
          await db.close();
          return { status: 200, content: { msg: `El carrito esta vacio` } };
        }
        let result = await cartsModel.findOneAndUpdate({ id: cartId }, { products: cartProducts });
        await db.close();
        if (result != null) {
          return {
            status: 200,
            content: { msg: `Producto con ID ${productId} borrado del carrito.` },
          };
        } else {
          return {
            status: 500,
            content: { msg: `No se pudo borrar el producto.` },
          };
        }
      } else {
        return {
          status: 200,
          content: { msg: `El carrito con ID ${cartId} no existe` },
        };
      }
    } catch (err) {
      logger.error(`Module: dao/mongoDB_carts.js Method: delProductFromCart -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }

  async getCartIdByUser(user) {
    const db = await this.#dbConnection();
    let cartId = await cartsModel.findOne({ user: user }, '_id');
    if (!cartId) {
      cartId = (await this.createCartId(user)).content;
    }
    await db.close();
    return { status: 200, content: cartId.id };
  }
}

const carts = new Carts();

export default carts;
