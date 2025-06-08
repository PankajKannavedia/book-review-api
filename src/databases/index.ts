import { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_DATABASE } from '@config';

const isLocalDB = DB_HOST === 'localhost' || DB_HOST === '127.0.0.1';

export const dbConnection = isLocalDB
  ? `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
  : `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
