const chai = require("chai");
const chaiHttp = require("chai-http");
const { init } = require("../../src/index");
const app = require("../../src/index");
require("dotenv").config();
let mysql = require("mysql2");


const Database = mysql.createConnection({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true
});
const { describe, it, beforeEach } = require("mocha");
const { should } = require("chai");
const JWT = require("jsonwebtoken");

require("dotenv").config();
let generatedToken = "";
const privateKey = "test";
let addedUser = 0;

chai.should();
chai.use(chaiHttp);

JWT.sign({ userId: 500 }, privateKey, { expiresIn: "1y" }, (err, token) => {
  if (err) console.log(err);
  generatedToken = token;
  console.log(generatedToken);
});

describe("Add users", () => {
  beforeEach(async () => {
    const promisePool = Database.promise();
    await promisePool.query("DELETE IGNORE FROM meal_participants_user");
    await promisePool.query("DELETE IGNORE FROM  meal");
    await promisePool.query("DELETE IGNORE FROM  user");
    await promisePool.query(
      "INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (500, 'John', 'Doe', '1', 'j.doe@server.com', '$2b$10$BLw0vofUcGyP3vrEcsNK7.LLDUU2HszuRFVtCtkzZ/xtJXDHks6o2', NULL, 'editor,guest', 'Lovensdijkstraat 61', 'Breda') "
    );
  });

    it("User already exists", (done) => {
      chai
        .request(app)
        .post(`/api/user/`)
        .auth(generatedToken, { type: "bearer" })
        .send({
          firstName: "John",
          lastName: "Doe",
          street: "Lovensdijkstraat 61",
          city: "Breda",
          password: "secret2555",
          emailAdress: "j.doe@server.com",
        })
        .end((err, res) => {
          res.should.be.an("object");
          res.should.have.status(409);
          res.body.should.be.an("object").that.has.all.keys("statusCode","message");

          done();
        });
    });

    it("When a required input is missing, returns valid error", (done) => {
      chai
        .request(app)
        .post("/api/user")
        .auth(generatedToken, { type: "bearer" })
        .send({
          lastName: "test",
          emailAdress: "test@test.nl",
          password: "test",
        })
        .end((err, res) => {
          res.should.be.an("object");
          res.should.have.status(400);
          res.body.should.be.an("object").that.has.all.keys("statusCode","message");
          done();
        });
    });

    it("password that does not meet the requirements", (done) => {
      chai
        .request(app)
        .post("/api/user")
        .auth(generatedToken, { type: "bearer" })
        .send({
          firstName: "John",
          lastName: "Doe",
          street: "Lovensdijkstraat 61",
          city: "Breda",
          password: "1",
          emailAdress: "j.doe@server.com",
        })
        .end((err, res) => {
          res.should.be.an("object");
          res.should.have.status(400);
          res.body.should.be.an("object").that.has.all.keys("statusCode","message");
          done();
        });
    });

    it("Add correct user", (done) => {
      chai
        .request(app)
        .post("/api/user")
              .auth(generatedToken, { type: "bearer" })
        .send({
          firstName: "John",
          lastName: "Doe",
          street: "Lovensdijkstraat 61",
          city: "Breda",
          password: "secret145",
          emailAdress: "jmm.doe@server.com",
        })
        .end((err, res) => {
          res.should.be.an("object");
          res.should.have.status(201);
          res.body.should.be.an("object");
          done();
        });
    });

    after(function(done) {
      Database.end();
      done();
     });   
  

  });



   


