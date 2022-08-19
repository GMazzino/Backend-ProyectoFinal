import express from 'express';
import { sep } from 'path';
import { Server as IOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import authRouter from './routes/auth.js';
import apiProductsRouter from './routes/products.js';
import apiCartsRouter from './routes/carts.js';
import apiOrdersRouter from './routes/orders.js';
import infoRouter from './routes/info.js';
import { chatMsgs } from './dao/dao.js';
import logger from './utils/logger.js';

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//Express server
app.set('views', `.${sep}src${sep}views`);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', authRouter);
app.use('/info', infoRouter);
app.use('/api/products', apiProductsRouter);
app.use('/api/shoppingcartproducts', apiCartsRouter);
app.use('/api/orders', apiOrdersRouter);
app.all('*', (req, res) => {
  logger.warn(`Method ${req.method} on route "${req.originalUrl}" not implemented.`);
  res.status(400).json({
    error: `Método ${req.method} en ruta '${req.originalUrl}' no implementado.`,
  });
});

//WS server
io.on('connection', (socket) => {
  socket.on('chatMsg', async (msg) => {
    const d = new Date();
    msg = JSON.parse(msg);
    msg.time = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    await chatMsgs.saveChatMsg(msg);
    io.sockets.emit('newChatMsg', JSON.stringify(msg));
  });
});

export { app, httpServer };
