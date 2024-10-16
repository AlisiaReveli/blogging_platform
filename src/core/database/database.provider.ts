import * as mongoose from 'mongoose';
import { MONGO_CONNECTION, DEVELOPMENT, TEST, PRODUCTION } from '../../../constants';
import { databaseConfig } from './database.config';

export const databaseProviders = [
  {
    provide: MONGO_CONNECTION,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }

      await mongoose.connect(config.uri);
      return mongoose;
    },
  },
];
