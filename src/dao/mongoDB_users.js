import { mongoose, userModel } from '../models/mongoDB_schemas.js';
import { mongoRemote } from '../../config.js';
import logger from '../utils/logger.js';
import { hashDehash } from '../utils/pwd_hash.js';
import crypto from 'crypto';

class User {
  async #dbConnection() {
    try {
      await mongoose.connect(mongoRemote.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      mongoose.connection.on('error', (err) => {
        logger.error(`${err}`);
        throw Error(err.message);
      });
      return mongoose.connection;
    } catch (err) {
      logger.error(`${err}`);
      throw Error(err.message);
    }
  }

  //---------------------------------------------------------------------------
  // findByUserId: Verifies if user exists in db.
  // Param email: users email (username)
  // Returns foundUser: user object with users info in case it exists in db or null otherwise
  //---------------------------------------------------------------------------
  async findByUserId(email) {
    if (email) {
      const db = await this.#dbConnection();
      try {
        const foundUser = await userModel.findOne({ email: email });
        await db.close();
        return foundUser;
      } catch (err) {
        logger.error(`${err}`);
        throw Error(err.message);
      }
    } else {
      throw new Error('Error en la petición. Se requiere usuario');
    }
  }

  //---------------------------------------------------------------------------
  // addUser: Adds a new user to db.
  // Params user: user object according to mongo DB user Schema
  //        pwd: plain password
  //---------------------------------------------------------------------------
  async addUser(user, pwd) {
    if (user.email && pwd) {
      try {
        let newUser = await this.findByUserId(user.email);
        if (!newUser) {
          const pwdHash = await hashDehash({ pwd: pwd, op: 'hash' });
          const db = await this.#dbConnection();
          newUser = await userModel.create({
            id: crypto.randomBytes(5).toString('hex'),
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            password: pwdHash,
            phone: user.phone,
            url: user.url,
          });
          await db.close();
          return newUser;
        } else {
          throw new Error('El usuario ingresado ya existe');
        }
      } catch (err) {
        logger.error(`Module: dao/MongoDB_users.js Method: addUser -> ${err}`);
        throw Error(err.message);
      }
    } else {
      throw new Error('Error en la petición. Se requiere usuario y contraseña');
    }
  }
}

export const user = new User();
