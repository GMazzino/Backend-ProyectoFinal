import { mongoose, productsModel } from '../models/mongoDB_schemas.js';
import { mongoRemote } from '../../config.js';
import logger from '../utils/logger.js';

class Products {
  async #dbConnection() {
    try {
      await mongoose.connect(mongoRemote.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      mongoose.connection.on('error', (err) => {
        logger.error(`Module: dao/mongoDB_products.js Method: #dbConnection (1) -> ${err}`);
        throw Error(err.message);
      });
      return mongoose.connection;
    } catch (err) {
      logger.error(`Module: dao/mongoDB_products.js Method: #dbConnection (2) -> ${err}`);
      throw Error(err.message);
    }
  }

  async getProducts() {
    const db = await this.#dbConnection();
    try {
      let products = await productsModel.find({});
      await db.close();
      return { status: 200, content: products };
    } catch (err) {
      logger.error(`Module: dao/mongoDB_products.js Method: getProducts -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }

  async getProductById(idProduct) {
    const db = await this.#dbConnection();
    try {
      const selectedProduct = await productsModel.find({ id: idProduct });
      if (selectedProduct.length) {
        return { status: 200, content: selectedProduct[0] };
      } else {
        return {
          status: 200,
          content: { msg: `Producto no encontrado` },
        };
      }
    } catch (err) {
      logger.error(`Module: dao/mongoDB_products.js Method: getProductsById -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }

  async delProductById(id) {
    const db = await this.#dbConnection();
    try {
      let del = await productsModel.findOneAndDelete({ id: id });
      if (del !== null) {
        return {
          status: 200,
          content: { msg: `Producto con ID: ${id} borrado` },
        };
      } else {
        return { status: 200, content: { msg: `Producto no encontrado` } };
      }
    } catch (err) {
      logger.error(`Module: dao/mongoDB_products.js Method: delProductById -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }

  async addNewProduct(product) {
    try {
      if (
        product.id != undefined &&
        product.id != '' &&
        product.name != undefined &&
        product.name != '' &&
        product.description != undefined &&
        product.description != '' &&
        product.price != undefined &&
        !isNaN(parseFloat(product.price)) &&
        product.image != undefined &&
        product.image != ''
      ) {
        const db = await this.#dbConnection();
        let newProduct = product;
        let createdProduct = await new productsModel(newProduct).save();
        return { status: 200, content: createdProduct };
      } else {
        return {
          status: 400,
          content: { msg: `Error en la petición del producto a agregar` },
        };
      }
    } catch (err) {
      logger.error(`Module: dao/mongoDB_products.js Method: addNewProduct -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }

  async updateProduct(id, product) {
    if (
      product.id != undefined &&
      product.id != '' &&
      product.name != undefined &&
      product.name != '' &&
      product.description != undefined &&
      product.description != '' &&
      product.price != undefined &&
      !isNaN(parseFloat(product.price)) &&
      product.image != undefined &&
      product.image != ''
    ) {
      try {
        const db = await this.#dbConnection();
        let updatedProduct = await productsModel.updateOne({ id: id }, product);
        if (updatedProduct.modifiedCount === 1) {
          return { status: 200, content: { msg: 'Producto actualizado' } };
        } else {
          return { status: 200, content: { msg: `Producto no encontrado` } };
        }
      } catch (err) {
        logger.error(`Module: dao/mongoDB_products.js Method: updateProduct -> ${err}`);
        return {
          status: 500,
          content: { msg: `Server error: ${err.message}` },
        };
      }
    } else {
      return { status: 400, content: { msg: `Error en la petición.` } };
    }
  }
}

const products = new Products();

export default products;
