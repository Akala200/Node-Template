import dotenv from 'dotenv';

dotenv.config();

const config = {
  MONGODB_DATABASE: process.env.DB_URL_DEV,
  DB_TEST: process.env.DB_URL_TEST || 'mongodb://wallet:wallet123@ds351455.mlab.com:51455/lotto-naija',
  BASE_URL_DEV: process.env.API_PASS,
  BASE_URL_PROD: process.env.API_TIMESTAMP,
  API_USER: process.env.API_USER,
  BET_API_EP_AUTH: process.env.BET_API_EP_AUTH,
  BET_API_EP: process.env.BET_API_EP,
  BET_API_EP_USERINFO: process.env.BET_API_EP_USERINFO,
  NODE_ENV: process.env.NODE_ENV,
  API_PASS: process.env.API_PASS,
  API_TIMESTAMP:  process.env.API_TIMESTAMP,
  BASE_URL_BETTING_DEV: process.env.BASE_URL_BETTING_DEV,
  BASE_URL_BETTING_PROD: process.env.BASE_URL_BETTING_PROD,
};

export default config;

// MONGODB_DATABASE: process.env.DB_URL_DEV || 'mongodb://localhost:27017/naija-lotto',

// DB_TEST: process.env.DB_URL_TEST || 'mongodb://localhost:27017/naijalotto-test'
