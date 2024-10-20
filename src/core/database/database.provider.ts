import * as mongoose from 'mongoose';
import { MONGO_CONNECTION } from '../../../constants';
import { databaseConfig } from './database.config';
import * as process from "node:process";

export const databaseProviders = [
  {
    provide: MONGO_CONNECTION,
    useFactory: async () => {
      let config;
      const env = process.env.NODE_ENV?.toLowerCase();
      console.log('NODE_ENV:', env);

      if (env === 'development') {
        config = databaseConfig.development;
      } else if (env === 'test') {
        config = databaseConfig.test;
      } else if (env === 'production') {
        config = databaseConfig.production;
      } else {
        config = databaseConfig.test;
      }

      console.log('Database URI:', config.uri);
      await mongoose.connect(config.uri);
      return mongoose;
    },
  },
];
