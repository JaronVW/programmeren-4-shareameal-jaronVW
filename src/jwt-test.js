const JWT = require("jsonwebtoken");
require("dotenv").config();
const privateKey =  "test";;

JWT.sign({ userid: 1 }, privateKey, (err, token) => {
  if (err) console.log(err);
  console.log(token);
});
