const chai = require("chai");
const chaiHttp = require("chai-http");
const { init } = require("../../src/index");
const app = require("../../src/index");
const Database = require("../../src/testdb");
const { describe, it, beforeEach } = require("mocha");
const { should } = require("chai");
const JWT = require("jsonwebtoken");

require("dotenv").config();
let generatedToken = "";
const privateKey =  "test";;
let addedUser = 0;

chai.should();
chai.use(chaiHttp);

JWT.sign({ userId: 500 }, privateKey, { expiresIn: "1y" }, (err, token) => {
  if (err) console.log(err);
  generatedToken = token;
});

describe("Delete meal", () => {
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
    await promisePool.query(
      "INSERT INTO `meal` (`id`, `isActive`, `isVega`, `isVegan`, `isToTakeHome`, `dateTime`, `maxAmountOfParticipants`, `price`, `imageUrl`, `cookId`, `createDate`, `updateDate`, `name`, `description`, `allergenes`) VALUES (10, '1', '0', '0', '1', '2022-05-17 09:27:39', '6', '6.75', 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg', '500', '2022-05-21 20:38:40.932000', '2022-05-21 20:38:40.932000', 'Lasagne', 'Dé pastaklassieker bij uitstek.', '') "
    );
    await promisePool.query(
        "INSERT INTO `meal` (`id`, `isActive`, `isVega`, `isVegan`, `isToTakeHome`, `dateTime`, `maxAmountOfParticipants`, `price`, `imageUrl`, `cookId`, `createDate`, `updateDate`, `name`, `description`, `allergenes`) VALUES (11, '1', '0', '0', '1', '2022-05-17 09:27:39', '6', '6.75', 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg', '501', '2022-05-21 20:38:40.932000', '2022-05-21 20:38:40.932000', 'Lasagne', 'Dé pastaklassieker bij uitstek.', '') "
    );
    addedUser = rows[1];
  });

  it("Succesfull delete", (done) => {
    chai
      .request(app)
      .delete(`/api/meal/10`)
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

  it("meal that does not exist", (done) => {
    chai
      .request(app)
      .delete(`/api/meal/1000`)
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

  it("Meal from diffrent owner", (done) => {
    chai
      .request(app)
      .delete(`/api/meal/11`)
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

  it("Unauthorized", (done) => {
    chai
      .request(app)
      .delete(`/api/meal/500`)
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(401);
        res.body.should.be
          .an("object")
          .that.has.all.keys("statusCode","message");
        done();
      });
  });

  
  


});
