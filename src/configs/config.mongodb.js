// level 01
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    uri: process.env.DEV_URI_MONGO_DB || ''
  },
};

const pro = {
  app: {
    port: process.env.PROD_APP_PORT || 3000,
  },
  db: {
    uri: process.env.PROD_URI_MONGO_DB || ''
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
