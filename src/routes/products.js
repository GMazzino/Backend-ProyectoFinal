import { Router } from 'express';
import { products } from '../dao/dao.js';
import * as jwt from '../utils/jwt.js';

const router = Router();

router.get('/', async (req, res) => {
  const ans = await products.getProducts();
  res.status(ans.status).json(ans.content);
});

router.get('/:id', async (req, res) => {
  let ans = await products.getProductById(req.params.id);
  res.status(ans.status).json(ans.content);
});

router.post('/', jwt.auth, jwt.isAdmin, async (req, res) => {
  let ans = await products.addNewProduct(req.body);
  res.status(ans.status).json(ans.content);
});

router.put('/:id', jwt.auth, jwt.isAdmin, async (req, res) => {
  let ans = await products.updateProduct(req.params.id, req.body);
  res.status(ans.status).json(ans.content);
});

router.delete('/:id', jwt.auth, jwt.isAdmin, async (req, res) => {
  let ans = await products.delProductById(req.params.id);
  res.status(ans.status).json(ans.content);
});

export default router;
