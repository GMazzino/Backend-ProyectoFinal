import * as dotenv from 'dotenv';
import parseArgs from 'minimist';

const options = {
  alias: {
    p: 'port',
    m: 'mode',
    e: 'env',
  },
  default: {
    port: 8080,
    mode: 'FORK',
    env: 'dev',
  },
};
const args = parseArgs(process.argv.slice(2), options);
dotenv.config({ path: args.env == 'dev' ? './dev.env' : './prod.env' });

export const APP_MODE = process.env.APP_MODE || args.mode;
export const PORT = process.env.PORT || args.port;
export const HOST = process.env.HOST || `http://localhost:${PORT}`;
export const mongoRemote = {
  client: 'mongodb',
  url: process.env.MONGO_URL,
  advancedOptions: { useNewUrlParser: true, useUnifiedTopology: true },
};
export const LOG_LEVEL = process.env.LOG_LEVEL;
export const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 12;
export const BCRYPT_SECRET = process.env.BCRYPT_SECRET || 'BCryPt_S3cR3t.';
export const ADMIN_MAIL = process.env.ADMIN_MAIL;
export const ADMIN_MAIL_PWD = process.env.ADMIN_MAIL_PWD;
export const ADMIN_USER = process.env.ADMIN_USER || 'admin@admin.com';
