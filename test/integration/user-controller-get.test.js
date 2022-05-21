const chai = require("chai");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const { init } = require("../../src/index");
const app = require("../../src/index");
const Database = require("../../src/db");
const { describe, it, beforeEach } = require("mocha");
const { should } = require("chai");

require("dotenv").config();
const token =  process.env.TEST_TOKEN;
let addedUser = 0;
console.log(token);

chai.should();
chai.use(chaiHttp);

describe("Get users", () => {
  beforeEach(async () => {
    const promisePool = Database.promise();
    await promisePool.query("DELETE IGNORE FROM meal_participants_user");
    await promisePool.query("DELETE IGNORE FROM  meal");
    await promisePool.query("DELETE IGNORE FROM  user");
    const [rows,fields] = await promisePool.query(
      "INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (NULL, 'John', 'Doe', '1', 'j.doe@server.com', '$2b$10$BLw0vofUcGyP3vrEcsNK7.LLDUU2HszuRFVtCtkzZ/xtJXDHks6o2', NULL, 'editor,guest', 'Lovensdijkstraat 61', 'Breda'); SELECT * FROM `user` WHERE id = LAST_INSERT_ID()"
    );
    addedUser = rows[1];
    console.log(addedUser[0].id)
  });

  it("Get zero users", (done) => {
    chai
      .request(app)
      .get("/api/user/?numberOfUsers=0")
      .auth(token, { type: 'bearer' })
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
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  it("Get active users", (done) => {
    chai
      .request(app)
      .get("/api/user/?isActive=1")
      .auth(token, { type: 'bearer' })
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
      .auth(token, { type: 'bearer' })
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
      .get("/api/user/1")
      .auth(token, { type: 'bearer' })
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
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
        res.should.be.an("object");
        // console.log(res.Message);
        res.should.have.status(200);
        done();
      });
  });
});
