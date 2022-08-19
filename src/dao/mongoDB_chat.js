import { mongoose, chatMsgsModel } from '../models/mongoDB_schemas.js';
import { mongoRemote } from '../../config.js';
import logger from '../utils/logger.js';

class Chat {
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

  async saveChatMsg(msg) {
    try {
      const db = await this.#dbConnection();
      await new chatMsgsModel({
        email: msg.email,
        fecha: msg.time,
        texto: msg.msg,
      }).save();
      await db.close();
      return { status: 200, content: { msg: 'Mensaje guardado' } };
    } catch (err) {
      logger.error(`Module: dao/mongoDB_chat.js Method: saveChatMsg -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }

  async getMsgs() {
    const db = await this.#dbConnection();
    try {
      let msgs = await chatMsgsModel.find({});
      await db.close();
      return { status: 200, content: msgs };
    } catch (err) {
      logger.error(`Module: dao/mongoDB_chat.js Method: getMsgs -> ${err}`);
      return {
        status: 500,
        content: { msg: `Server error: ${err.message}` },
      };
    }
  }
}

const chatMsgs = new Chat();

export default chatMsgs;
