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

generatedToken = JWT.sign({ userId: 500 }, privateKey, { expiresIn: "1y" });

describe("Add meal", () => {
  beforeEach(async () => {
    const promisePool = Database.promise();
    await promisePool.query("DELETE IGNORE FROM meal_participants_user");
    await promisePool.query("DELETE IGNORE FROM  meal");
    await promisePool.query("DELETE IGNORE FROM  user");
    const [rows, fields] = await promisePool.query(
      "INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (500, 'John', 'Doe', '1', 'j.doe@server.com', '$2b$10$BLw0vofUcGyP3vrEcsNK7.LLDUU2HszuRFVtCtkzZ/xtJXDHks6o2', NULL, 'editor,guest', 'Lovensdijkstraat 61', 'Breda'); SELECT * FROM `user` WHERE id = LAST_INSERT_ID()"
    );
    addedUser = rows[1];
  });

  it("Missing field", (done) => {
    chai
      .request(app)
      .post(`/api/meal/`)
      .auth(generatedToken, { type: "bearer" })
      .send({
        isActive: true,
        isVega: false,
        isVegan: false,
        isToTakeHome: true,
        dateTime: "2022-05-21 07:11:46",
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

  it("Not logged in", (done) => {
    chai
      .request(app)
      .post(`/api/meal/`)
      .send({
        name: "Lasagne",
        description: "Dé pastaklassieker bij uitstek.",
        isActive: true,
        isVega: false,
        isVegan: false,
        isToTakeHome: true,
        dateTime: "2022-05-21 07:11:46",
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

  it("Correct request", (done) => {
    chai
      .request(app)
      .post(`/api/meal/`)
      .auth(generatedToken, { type: "bearer" })
      .send({
        name: "Lasagne",
        description: "Dé pastaklassieker bij uitstek.",
        isActive: true,
        isVega: false,
        isVegan: false,
        isToTakeHome: true,
        dateTime: "2022-05-21 07:11:46",
        imageUrl:
          "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
        allergenes: ["gluten", "noten", "lactose"],
        maxAmountOfParticipants: 6,
        price: 6.75,
      })
      .end((err, res) => {
        res.should.be.an("object");
        res.should.have.status(201);
        res.body.should.be.an("object").that.has.all.keys("result");
        done();
      });
  });

  after(function (done) {
    Database.end();
    done();
  });
});
