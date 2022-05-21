const chai = require("chai");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const { init } = require("../../src/index");
const app = require("../../src/index");
const Database = require("../../src/db");
const { describe, it, beforeEach } = require("mocha");
const { should } = require("chai");

require("dotenv").config();
const token = process.env.TEST_TOKEN;
let addedUser = 0;

chai.should();
chai.use(chaiHttp);

describe("Delete users", () => {
  beforeEach(async () => {
    const promisePool = Database.promise();
    await promisePool.query("DELETE IGNORE FROM meal_participants_user");
    await promisePool.query("DELETE IGNORE FROM  meal");
    await promisePool.query("DELETE IGNORE FROM  user");
    const [rows, fields] = await promisePool.query(
      "INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (NULL, 'John', 'Doe', '1', 'j.doe@server.com', '$2b$10$BLw0vofUcGyP3vrEcsNK7.LLDUU2HszuRFVtCtkzZ/xtJXDHks6o2', NULL, 'editor,guest', 'Lovensdijkstraat 61', 'Breda'); SELECT * FROM `user` WHERE id = LAST_INSERT_ID()"
    );
    await promisePool.query(
      "INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (NULL, 'John', 'Doe', '1', 'm.doe@server.com', '$2b$10$BLw0vofUcGyP3vrEcsNK7.LLDUU2HszuRFVtCtkzZ/xtJXDHks6o2', NULL, 'editor,guest', 'Lovensdijkstraat 61', 'Breda'); SELECT * FROM `user` WHERE id = LAST_INSERT_ID()"
    );
    addedUser = rows[1];
  });

  it("Delete user that does not exist", (done) => {
    chai
      .request(app)
      .delete(`/api/user/1`)
      .auth(token, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(404);
        
        done();
      });
  });

  it("Delete user that does exist", (done) => {
    chai
      .request(app)
      .delete(`/api/user/${id}`)
      .auth(token, { type: "bearer" })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(200);
        done();
      });
  });
});
