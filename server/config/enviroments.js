import dotenv from 'dotenv';

dotenv.config();

const config = {
  dev: {
    MONGODB_URI: process.env.MONGO_DEV,
  },
  test: {
    MONGODB_URI: process.env.MONGO_TEST,
    PORT: process.env.TESTING_PORT,
  },
};

const env = process.env.NODE_ENV || 'dev';
if (env.trim() === 'dev' || env.trim() === 'test') {
  const envConfig = config[env.trim()];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}