import express from 'express';
import { getInfo } from '../handlers/routers/info.js';

const { Router } = express;
const router = new Router();

router.get('/', getInfo);

export default router;
