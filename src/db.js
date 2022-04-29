require("dotenv").config();
let mysql = require("mysql2");

const databasePool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASWORD,
  database: process.env.DB_DATABASE,
});




databasePool.end((err) => {
  if (err) {
    console.log(err);
  }
  console.log("pool closed");
});
