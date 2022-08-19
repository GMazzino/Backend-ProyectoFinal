import { Router } from 'express';
import { orders } from '../dao/dao.js';
import * as jwt from '../utils/jwt.js';

const router = Router();

router.get('/', jwt.auth, async (req, res) => {
  const ans = await orders.getOrdersByUserId(req.email);
  res.status(ans.status).json(ans.content);
});

router.post('/', jwt.auth, async (req, res) => {
  const ans = await orders.newOrder(req.email);
  res.status(ans.status).json(ans.content);
});

export default router;
