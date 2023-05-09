//include .env file
require ('dotenv').config();

const mysql = require ('mysql2');

const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log("DB Connected!");
//console.log(connection);

module.exports = connection;