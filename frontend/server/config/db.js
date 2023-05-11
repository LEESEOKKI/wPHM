const mysql = require('mysql');

const db = mysql.createPool({
    host: 'userdb.cx55vpygqa3v.us-east-2.rds.amazonaws.com',
    port: '3306',
    user: 'wonik1',
    password: 'zz!123456',
    database: 'UserDB'
});

module.exports = db;