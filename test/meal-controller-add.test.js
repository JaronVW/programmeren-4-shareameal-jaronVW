const chai = require("chai");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
// const { init } = require("../../src/index")
const app = require("../src/index");
const Database = require("../src/db");
const { describe, it, beforeEach } = require("mocha");
const { should } = require("chai");

chai.should();
chai.use(chaiHttp);

describe("Authentication", () => {
  describe("Add user api/user", () => {
    beforeEach(async () => {
      const promisePool = Database.promise();
      await promisePool.query("DELETE IGNORE FROM meal_participants_user");
      await promisePool.query("DELETE IGNORE FROM  meal");
      await promisePool.query("DELETE IGNORE FROM  user");
      await promisePool.query(
        "INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (NULL, 'John', 'Doe', '1', 'j.doe@server.com', '$2b$10$BLw0vofUcGyP3vrEcsNK7.LLDUU2HszuRFVtCtkzZ/xtJXDHks6o2', NULL, 'editor,guest', 'Lovensdijkstraat 61', 'Breda') "
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
          // console.log(res.Message);
          res.should.have.status(400);
          // TODO implement tests for correct output
          done();
        });
    });

    it("Succesfull login", (done) => {
      chai
        .request(app)
        .post(`/api/auth/login`)
        .send({
          emailaddress: "j.doe@server.com",
          password: "secret",
        })
        .end((err, res) => {
          res.should.be.an("object");
          res.should.have.status(200);

          res.body.should.be
            .an("object")
            .that.has.all.keys("statusCode", "result");
          result.should.be.a("string").that.contains("error");
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
          res.should.have.status(404);
          res.body.should.be.an("object").that.has.all.keys("statusCode","message");
          message.should.be.a("string").that.contains("error");
          done();
        });
    });
  });
});
