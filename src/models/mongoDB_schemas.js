import mongoose from 'mongoose';

//-----------------------------------------------------------------------------
// COLLECTIONS
//-----------------------------------------------------------------------------
const usersCollection = 'users';
const productsCollection = 'products';
const cartsCollection = 'carts';
const ordersCollection = 'orders';
const chatMsgsCollection = 'chat';

//-----------------------------------------------------------------------------
// SCHEMAS
//-----------------------------------------------------------------------------
const usersSchema = new mongoose.Schema(
  {
    id: { type: String, maxlength: 10, required: true },
    name: { type: String, maxlength: 20, required: true },
    lastname: { type: String, maxlength: 30, required: true },
    email: { type: String, maxLength: 50, required: true },
    password: { type: String, maxLength: 60, required: true },
    phone: { type: String, maxlength: 14, required: true },
    url: { type: String, maxlength: 55 },
  },
  { versionKey: false }
);

const productsSchema = new mongoose.Schema(
  {
    id: { type: String, maxLength: 25, required: true },
    name: { type: String, maxLength: 50, required: true },
    description: { type: String, maxLength: 100, required: true },
    price: { type: Number, required: true },
    image: { type: String, maxLength: 200, required: true },
  },
  { versionKey: false }
);

const cartsSchema = new mongoose.Schema(
  {
    id: { type: String, maxLength: 50, required: true },
    products: { type: Object },
  },
  { versionKey: false }
);

const ordersSchema = new mongoose.Schema(
  {
    id: { type: String, maxlength: 10, required: true },
    fecha: { type: Date },
    idCliente: { type: String, maxLength: 50, required: true },
    prods: { type: Object },
  },
  { versionKey: false }
);

const chatMsgsSchema = new mongoose.Schema(
  {
    email: { type: String, maxlength: 50, required: true },
    fecha: { type: Date, required: true },
    texto: { type: String, maxlength: 250, required: true },
  },
  { versionKey: false }
);

//-----------------------------------------------------------------------------
// MODELS
//-----------------------------------------------------------------------------
const userModel = mongoose.model(usersCollection, usersSchema);
const productsModel = mongoose.model(productsCollection, productsSchema);
const cartsModel = mongoose.model(cartsCollection, cartsSchema);
const ordersModel = mongoose.model(ordersCollection, ordersSchema);
const chatMsgsModel = mongoose.model(chatMsgsCollection, chatMsgsSchema);

export { mongoose, userModel, productsModel, cartsModel, ordersModel, chatMsgsModel };
