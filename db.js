const mysql=require('mysql2');
const dbConfig=require('./db.config');


const connection=mysql.createPool({ //createPool allow mutiple connection in the same time
    host:dbConfig.HOST,
    user:dbConfig.USER,
    database:dbConfig.DATABASE,
    password:dbConfig.PASSWORD,
    pool:dbConfig.PORT
});

module.exports=connection.promise();
