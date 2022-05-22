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

describe("Authentication", () => {
  beforeEach(async () => {
    const promisePool = Database.promise();
    await promisePool.query("DELETE IGNORE FROM meal_participants_user");
    await promisePool.query("DELETE IGNORE FROM  meal");
    await promisePool.query("DELETE IGNORE FROM  user");
    await promisePool.query(
      "INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (500, 'John', 'Doe', '1', 'j.doe@server.com', '$2b$10$29kBZvA/Z2zdqN0yi2mw4eOQ0BZUAU582s2rntZivVt4D2UjAzs7u', NULL, 'editor,guest', 'Lovensdijkstraat 61', 'Breda') "
    );
  });

  it("Missing field", (done) => {
    chai
      .request(app)
      .post(`/api/auth/login`)
      .send({
        password: "secret",
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.all.keys("statusCode","message");
        let { message } = res.body;
        message.should.be.a("string");
        done();
      });
  });

  it("Succesfull login", (done) => {
    chai
      .request(app)
      .post(`/api/auth/login`)
      .send({
        emailaddress: "j.doe@server.com",
        password: "secret2555",
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(200);

        res.body.should.be.an("object").that.has.all.keys("result");
        let { result } = res.body;
        result.should.be.an("object")
        done();
      });
  });

  it("Invalid email", (done) => {
    chai
      .request(app)
      .post(`/api/auth/login`)
      .send({
        emailaddress: "jDoe",
        password: "secret",
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.all.keys("statusCode","message");
        let { message } = res.body;
        message.should.be.a("string");
        done();
      });
  });

  it("User does not exist", (done) => {
    chai
      .request(app)
      .post(`/api/auth/login`)
      .send({
        emailaddress: "admin@server.com",
        password: "supersecret",
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(404);
        res.body.should.be.an("object").that.has.all.keys("statusCode","message");
        let { message } = res.body;
        message.should.be.a("string");
        done();
      });
  });

  it("invalid password", (done) => {
    chai
      .request(app)
      .post(`/api/auth/login`)
      .send({
        emailaddress: "j.doe@server.com",
        password: "geheim",
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(400);

        res.body.should.be.an("object").that.has.all.keys("statusCode","message");
        done();
      });
  });

  after(function(done) {
    Database.end();
    done();
   });


});
