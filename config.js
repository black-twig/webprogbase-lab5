require('dotenv').config();
const config = {
    app: {
      port: process.env.APP_PORT
    },
    db: {
      host: process.env.DB_HOST,
      login: process.env.DB_LOGIN,
      password: process.env.DB_PW,
      name: process.env.DB_NAME
    }
   };
   
module.exports = config;
  