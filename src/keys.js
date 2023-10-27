const config = require('./config');

module.exports = {

    
    database: {
      connectionLimit: 1000,
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database
    }
  


  //cuando se usa un hosting 
  /*   
  database: {
    connectionLimit: 1000,
    host: 'pro.freedb.tech',
    user: 'AdmIsmina',
    password: '$kqFCKrH8nMkXW2',
    database: 'PreIsmina'
  }*/

};


