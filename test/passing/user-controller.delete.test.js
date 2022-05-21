const chai = require("chai");
const chaiHttp = require("chai-http");
const { init } = require("../../src/index");
const app = require("../../src/index");
const Database = require("../../src/db");
const { describe, it, beforeEach } = require("mocha");
const { should } = require("chai");
const JWT = require("jsonwebtoken");

require("dotenv").config();
let generatedToken = "";
const privateKey = process.env.SECRET_JWT_KEY;
let addedUser = 0;

chai.should();
chai.use(chaiHttp);

JWT.sign({ userId: 500 }, privateKey, { expiresIn: "1y" }, (err, token) => {
  if (err) console.log(err);
  generatedToken = token;
});

describe("Delete users", () => {
  beforeEach(async () => {
    const promisePool = Database.promise();
    await promisePool.query("DELETE IGNORE FROM meal_participants_user");
    await promisePool.query("DELETE IGNORE FROM  meal");
    await promisePool.query("DELETE IGNORE FROM  user");
    const [rows, fields] = await promisePool.query(
      "INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (500, 'John', 'Doe', '1', 'j.doe@server.com', '$2b$10$BLw0vofUcGyP3vrEcsNK7.LLDUU2HszuRFVtCtkzZ/xtJXDHks6o2', NULL, 'editor,guest', 'Lovensdijkstraat 61', 'Breda'); SELECT * FROM `user` WHERE id = LAST_INSERT_ID()"
    );
    await promisePool.query(
      "INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (501, 'John', 'Doe', '1', 'm.doe@server.com', '$2b$10$BLw0vofUcGyP3vrEcsNK7.LLDUU2HszuRFVtCtkzZ/xtJXDHks6o2', NULL, 'editor,guest', 'Lovensdijkstraat 61', 'Breda'); SELECT * FROM `user` WHERE id = LAST_INSERT_ID()"
    );
    addedUser = rows[1];
  });

  it("Delete user that does not exist", (done) => {
    chai
      .request(app)
      .delete(`/api/user/10000000000000`)
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(404);
        res.body.should.be
          .an("object")
          .that.has.all.keys("statusCode","message");
        done();
      });
  });

  it("Delete user that is not allowed", (done) => {
    chai
      .request(app)
      .delete(`/api/user/501`)
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(403);
        res.body.should.be
          .an("object")
          .that.has.all.keys("statusCode","message");
        done();
      });
  });

  it("Unathorized", (done) => {
    chai
      .request(app)
      .delete(`/api/user/50`)
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(401);
        res.body.should.be
          .an("object")
          .that.has.all.keys("statusCode","message");
        done();
      });
  });


  it("Delete user that is allowed", (done) => {
    chai
      .request(app)
      .delete(`/api/user/500`)
      .auth(generatedToken, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(200);
        res.body.should.be
          .an("object")
          .that.has.all.keys("statusCode","message");
        done();
      });
  });

});
