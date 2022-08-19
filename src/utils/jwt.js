import jwt from 'jsonwebtoken';
import { ADMIN_USER } from '../../config.js';

const JWT_SECRET = process.env.JWT_SECRET;

export function createJWT(email) {
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
  return token;
}

export function auth(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';

  if (!authHeader) {
    return res.status(401).json({
      msg: 'Se requiere autenticación para acceder al recurso solicitado',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      msg: 'Se requiere autenticación para acceder al recurso solicitado',
    });
  }

  try {
    const originalData = jwt.verify(token, JWT_SECRET);
    req.email = originalData.email;
  } catch (ex) {
    return res.status(403).json({
      msg: 'Se requiere autenticación para acceder al recurso solicitado',
    });
  }
  next();
}

export function isAdmin(req, res, next) {
  req.email == ADMIN_USER
    ? next()
    : res.status(401).json({ msg: 'No tiene los permisos requeridos para la operación solicitada' });
}
