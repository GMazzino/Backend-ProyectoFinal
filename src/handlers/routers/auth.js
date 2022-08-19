import { user } from '../../dao/mongoDB_users.js';
import * as jwt from '../../utils/jwt.js';
import logger from '../../utils/logger.js';
import { hashDehash } from '../../utils/pwd_hash.js';

export async function newUserRegistration(req, res) {
  const newUser = req.body;
  // In case no avantar img is uploaded a default one is used
  try {
    newUser.url =
      newUser.email.replace(/\./g, '') + req.file.originalname.slice(req.file.originalname.lastIndexOf('.'));
  } catch {
    newUser.url = 'avatar.jpg';
  }
  try {
    await user.addUser(newUser, newUser.password);
    const token = jwt.createJWT(newUser.email);
    res.status(200).json({ token });
  } catch (err) {
    logger.error(`Module: handlers/routers/auth.js Method: NewUserRegistration -> ${err}`);
    res.status(400).json({ error: `${err}` });
  }
}

export async function userLogin(req, res) {
  let foundUser;
  let pwdOk = false;
  let userLogingIn = req.body;
  try {
    foundUser = await user.findByUserId(userLogingIn.email);
    if (foundUser?.password) {
      pwdOk = await hashDehash({
        pwd: userLogingIn.password,
        pwdHash: foundUser.password,
        op: 'dehash',
      });
    }
  } catch (err) {
    logger.error(`Module: handlers/router/auth.js Method: userLogin -> ${err}`);
    res.status(403).json({ error: `${err}` });
  }
  if (pwdOk) {
    const token = jwt.createJWT(userLogingIn.email);
    res.status(200).json({ name: `${foundUser.name}`, token });
  } else {
    res.status(401).json({ error: 'Usuario o password incorrectos' });
  }
}
