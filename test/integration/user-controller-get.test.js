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
  multipleStatements: true,
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
});

describe("Get users", () => {
  beforeEach(async () => {
    const promisePool = Database.promise();
    await promisePool.query("DELETE IGNORE FROM meal_participants_user");
    await promisePool.query("DELETE IGNORE FROM  meal");
    await promisePool.query("DELETE IGNORE FROM  user");
    const [rows, fields] = await promisePool.query(
      "INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (NULL, 'John', 'Doe', '1', 'j.doe@server.com', '$2b$10$BLw0vofUcGyP3vrEcsNK7.LLDUU2HszuRFVtCtkzZ/xtJXDHks6o2', NULL, 'editor,guest', 'Lovensdijkstraat 61', 'Breda'); SELECT * FROM `user` WHERE id = LAST_INSERT_ID()"
    );
    addedUser = rows[1];
  });

  it("Get zero users", (done) => {
    chai
      .request(app)
      .get("/api/user/?numberOfUsers=0")
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  it("Get two users", (done) => {
    chai
      .request(app)
      .get("/api/user/?numberOfUsers=2")
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  it("search name that does not exist", (done) => {
    chai
      .request(app)
      .get("/api/user/?firstname=chris")
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  it("get inactive users ", (done) => {
    chai
      .request(app)
      .get("/api/user/?isActive=0")
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  it("get active users ", (done) => {
    chai
      .request(app)
      .get("/api/user/?isActive=1")
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  it("get two users ", (done) => {
    chai
      .request(app)
      .get("/api/user/?isActive=1&firstname=John")
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  it("Unathorized request ", (done) => {
    chai
      .request(app)
      .get("/api/user/")
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(401);
        res.body.should.be
          .an("object")
          .that.has.all.keys("statusCode", "message");
        done();
      });
  });

  it("Get active users", (done) => {
    chai
      .request(app)
      .get("/api/user/?isActive=1")
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  it("Get inactive users", (done) => {
    chai
      .request(app)
      .get("/api/user/?isActive=0")
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  it("Get user that does not exist", (done) => {
    chai
      .request(app)
      .get("/api/user/1000000000000")
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(404);

        done();
      });
  });

  it("Get user that does exist", (done) => {
    chai
      .request(app)
      .get(`/api/user/${addedUser[0].id}`)
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        done();
      });
  });

  it("Get user profile", (done) => {
    chai
      .request(app)
      .get(`/api/user/profile`)
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        done();
      });
  });

  it("Get user with specific name", (done) => {
    chai
      .request(app)
      .get(`/api/user/?firstname=John`)
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        done();
      });
  });

  after(function (done) {
    Database.end();
    done();
  });
});
