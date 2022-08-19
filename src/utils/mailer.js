import mailer from 'nodemailer';
import { ADMIN_MAIL, ADMIN_MAIL_PWD } from '../../config.js';
import logger from './logger.js';

const mailSender = mailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: ADMIN_MAIL,
    pass: ADMIN_MAIL_PWD,
  },
});

const mailData = {
  from: 'E-Commerce Server',
  to: ADMIN_MAIL,
  subject: '',
  html: '',
};

export default async function sendMail(data, type) {
  switch (type) {
    case 'user':
      mailData.subject = 'Se ha recibido su pedido';
      mailData.html = `Hemos recibido su pedido y a continuación se encuentra el detalle.<br /><br />`;
      mailData.to = data.idCliente;
      break;

    case 'admin':
      mailData.subject = `Nuevo pedido de ${data.idCliente}`;
      mailData.html = 'Se informa detalle de nuevo pedido: <br /> <br />';
      break;

    default:
      logger.warn(`Module: utils/mailer.js. Method: sendmail -> No match to send email.`);
      break;
  }
  let totalOrder = 0;
  data.prods.forEach((p) => {
    mailData.html += `Articulo: ${p.id}<br />`;
    mailData.html += `Nombre: ${p.name}<br />`;
    mailData.html += `Descripcion: ${p.description}<br />`;
    mailData.html += `Cantidad: ${p.quantity}<br />`;
    mailData.html += `Precio unit: $ ${p.price}<br />`;
    mailData.html += `Total: $ ${parseInt(p.quantity) * parseFloat(p.price)}<br /><br />`;
    totalOrder += parseInt(p.quantity) * parseFloat(p.price);
  });
  mailData.html += `Total del pedido: $ ${totalOrder}`;

  try {
    mailSender.sendMail(mailData);
  } catch (err) {
    logger.error(`Module: utils/mailer.js Method: sendMail -> ${err}`);
  }
}
