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

describe("Update meal", () => {
  beforeEach(async () => {
    const promisePool = Database.promise();
    await promisePool.query("DELETE IGNORE FROM meal_participants_user");
    await promisePool.query("DELETE IGNORE FROM  meal");
    await promisePool.query("DELETE IGNORE FROM  user");
    await promisePool.query(
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
  });

  it("When a required input is missing, returns valid error", (done) => {
    chai
      .request(app)
      .put("/api/meal/10")
      .auth(generatedToken, { type: "bearer" })
      .send({
        isActive: true,
        isVega: true,
        isVegan: true,
        isToTakeHome: true,
        dateTime: "2022-05-17T09:27:39.172Z",
        imageUrl:
          "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
        allergenes: ["gluten", "noten", "lactose"],
        maxAmountOfParticipants: 6,
        price: 6.75,
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(400);
        res.body.should.be
          .an("object")
          .that.has.all.keys("statusCode", "message");
        done();
      });
  });

  it("Edit meal that does not belong to logged in user", (done) => {
    chai
      .request(app)
      .put("/api/meal/11")
      .auth(generatedToken, { type: "bearer" })
      .send({
        name: "Spaghetti saus",
        description: "Dé pastaklassieker bij uitstek.",
        isActive: true,
        isVega: true,
        isVegan: true,
        isToTakeHome: true,
        dateTime: "2022-05-17T09:27:39.172Z",
        imageUrl:
          "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
        allergenes: ["gluten", "noten", "lactose"],
        maxAmountOfParticipants: 6,
        price: 6.75,
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(403);
        res.body.should.be
          .an("object")
          .that.has.all.keys("statusCode", "message");
        done();
      });
  });

  it("Edit meal that does not exist", (done) => {
    chai
      .request(app)
      .put("/api/meal/100000")
      .auth(generatedToken, { type: "bearer" })
      .send({
        name: "Spaghetti saus",
        description: "Dé pastaklassieker bij uitstek.",
        isActive: true,
        isVega: true,
        isVegan: true,
        isToTakeHome: true,
        dateTime: "2022-05-17T09:27:39.172Z",
        imageUrl:
          "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
        allergenes: ["gluten", "noten", "lactose"],
        maxAmountOfParticipants: 6,
        price: 6.75,
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(404);
        res.body.should.be
          .an("object")
          .that.has.all.keys("statusCode", "message");
        done();
      });
  });

  it("Succesfull edit", (done) => {
    chai
      .request(app)
      .put("/api/meal/10")
      .auth(generatedToken, { type: "bearer" })
      .send({
        name: "Spaghetti saus",
        description: "Dé pastaklassieker bij uitstek.",
        isActive: true,
        isVega: true,
        isVegan: true,
        isToTakeHome: true,
        dateTime: "2022-05-17T09:27:39.172Z",
        imageUrl:
          "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
        allergenes: ["gluten", "noten", "lactose"],
        maxAmountOfParticipants: 6,
        price: 6.75,
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  it("Unauthorized", (done) => {
    chai
      .request(app)
      .put("/api/meal/10")
      .send({
        name: "Spaghetti saus",
        description: "Dé pastaklassieker bij uitstek.",
        isActive: true,
        isVega: true,
        isVegan: true,
        isToTakeHome: true,
        dateTime: "2022-05-17T09:27:39.172Z",
        imageUrl:
          "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
        allergenes: ["gluten", "noten", "lactose"],
        maxAmountOfParticipants: 6,
        price: 6.75,
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(401);
        res.body.should.be
          .an("object")
          .that.has.all.keys("statusCode", "message");
        done();
      });
  });

  after(function (done) {
    Database.end();
    done();
  });
});
