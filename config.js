require('dotenv').config();
const config = {
    app: {
      port: process.env.APP_PORT || 3000
    },
    db: {
      host: process.env.DB_HOST || 'lab4.0pfe1.mongodb.net',
      login: process.env.DB_LOGIN || 'User123',
      password: process.env.DB_PW || '123qweasd',
      name: process.env.DB_NAME || 'Labs'
    }
   };
   
module.exports = config;
  