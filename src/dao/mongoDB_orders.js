import { mongoose, ordersModel } from '../models/mongoDB_schemas.js';
import { carts, products } from '../dao/dao.js';
import { mongoRemote } from '../../config.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';
import sendMail from '../utils/mailer.js';

class Orders {
  async #dbConnection() {
    try {
      await mongoose.connect(mongoRemote.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      mongoose.connection.on('error', (err) => {
        logger.error(`Module: dao/mongoDB_orders.js Method: #dbConnection (1) -> ${err}`);
        throw Error(err.message);
      });
      return mongoose.connection;
    } catch (err) {
      logger.error(`Module: dao/mongoDB_orders.js Method: #dbConnection (2) -> ${err}`);
      throw Error(err.message);
    }
  }

  async getOrdersByUserId(userId) {
    const db = await this.#dbConnection();
    const orders = await ordersModel.find({ idCliente: userId });
    db.close();
    return { status: 200, content: orders };
  }

  async newOrder(userId) {
    const orderProducts = [];
    const draftOrder = {};
    try {
      const cartProducts = (await carts.getCartProducts(userId)).content;
      if (cartProducts.length) {
        const productsCatalog = (await products.getProducts()).content;
        cartProducts.forEach((cp) => {
          productsCatalog.forEach((e) => {
            if (cp.id == e.id) {
              cp.name = e.name;
              cp.description = e.description;
              cp.price = e.price;
              cp.image = e.image;
              orderProducts.push(cp);
            }
          });
        });
        draftOrder.id = crypto.randomBytes(5).toString('hex');
        draftOrder.fecha = Date.now();
        draftOrder.idCliente = userId;
        draftOrder.prods = orderProducts;
        const db = await this.#dbConnection();
        const newOrder = await new ordersModel(draftOrder).save();
        await carts.delCart(userId);
        db.close();
        sendMail(newOrder, 'admin');
        sendMail(newOrder, 'user');
        return { status: 200, content: newOrder };
      } else {
        return { status: 400, content: { msg: 'Carrito vacío' } };
      }
    } catch (err) {
      logger.error(`Module: dao/mongoDB_orders.js Method: newOrder -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }
}
const orders = new Orders();

export default orders;
