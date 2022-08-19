import { Router } from 'express';
import { carts } from '../dao/dao.js';
import * as jwt from '../utils/jwt.js';

const router = Router();

// Gets cart products
router.get('/', jwt.auth, async (req, res) => {
  let ans = await carts.getCartProducts(req.email);
  res.status(ans.status).json(ans.content);
});

// Adds/updates product to/in cart
router.post('/', jwt.auth, async (req, res) => {
  let ans = await carts.addProductToCart(req.email, req.body.productId);
  res.status(ans.status).json(ans.content);
});

// Deletes cart product
router.delete('/:idProd', jwt.auth, async (req, res) => {
  let ans = await carts.delProductFromCart(req.email, req.params.idProd);
  res.status(ans.status).json(ans.content);
});

// Deletes cart and products
router.delete('/:id', async (req, res) => {
  let ans = await carts.delCart(req.params.id);
  res.status(ans.status).json(ans.content);
});

export default router;
