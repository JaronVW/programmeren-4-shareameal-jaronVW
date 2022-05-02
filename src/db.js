require("dotenv").config();
let mysql = require("mysql2");

const Database = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASWORD,
  database: process.env.DB_DATABASE,
});



module.exports = Database;
