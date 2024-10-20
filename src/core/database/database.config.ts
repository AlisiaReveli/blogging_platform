import * as dotenv from 'dotenv';
import { type IDatabaseConfig } from './interface/dbConfig.interface';

dotenv.config()

export const databaseConfig = {
  development: {
    uri: process.env.MONGO_URI_DEVELOPMENT ?? ''
  },
  test: {
    uri: process.env.MONGO_URI_TEST ?? ''
  },
  production: {
    uri: process.env.MONGO_URL ?? ''
  },
};
