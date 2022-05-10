const chai = require("chai");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const { init } = require("../../src/index");
const app = require("../../src/index");
const Database = require("../../src/db");
const { describe, it, beforeEach } = require("mocha");
const { should } = require("chai");
const testDB = require("./testdb");

chai.should();
chai.use(chaiHttp);

describe("Manage users", () => {
  describe("Add user api/user", () => {
    beforeEach(() => {
      Database.query("DELETE IGNORE FROM meal_participants_user");
      Database.query("DELETE IGNORE FROM  meal");
      Database.query("DELETE IGNORE FROM  user");
    });

    it("When a required input is missing, returns valid error", (done) => {
      chai
        .request(app)
        .post("/api/user")
        .send({
          lastName: "test",
          emailAdress: "test@test.nl",
          password: "test",
        })
        .end((err, res) => {
          res.should.be.an("object");
          res.should.have.status(400);
          let { Status, Message } = res.body;
          Message.should.be
            .a("string")
            .that.equals("first name must be a string");
          done();
        });
    });

    // it("User already exists", (done) => {
    //   const query =
    //     "SET @email = 'j.doe@server.com'; " +
    //     "INSERT INTO user (`firstName`, `lastName`,`street`,  `city`,  `password`,`emailAdress`) VALUES ('John','Doe','Lovensdijkstraat 61','Breda','secret',@email);" +
    //     "SELECT id FROM user ";
    //   let id = "";
    //   Database.query(query, (err, rows, fields) => {
    //     console.log(err)
    //     id = rows[2][0].id;
    //   });
    //   chai
    //     .request(app)
    //     .post(`/api/user/${id}`)
    //     .send({
    //       firstName: "John",
    //       lastName: "Doe",
    //       street: "Lovensdijkstraat 61",
    //       city: "Breda",
    //       password: "secret",
    //       emailAdress: "j.doe@server.com",
    //     })
    //     .end((err, res) => {
    //       res.should.be.an("object");
    //       // console.log(res.Message);
    //       res.should.have.status(409);

    //       done();
    //     });
    // });

    it("Add correct user", (done) => {
      chai
        .request(app)
        .post("/api/user")
        .send({
          firstName: "John",
          lastName: "Doe",
          street: "Lovensdijkstraat 61",
          city: "Breda",
          password: "secret",
          emailAdress: "j.doe@server.com",
        })
        .end((err, res) => {
          res.should.be.an("object");
          // console.log(res.Message);
          res.should.have.status(200);

          done();
        });
    });
  });

  describe("get users api/user", () => {
    beforeEach(() => {
      Database.query("DELETE IGNORE FROM meal_participants_user");
      Database.query("DELETE IGNORE FROM  meal");
      Database.query("DELETE IGNORE FROM  user");
    });

    it("Get user that does not exist", (done) => {
      // Database.query("INSERT INTO user (firstName,lastName,street,city,password,emailAdress) VALUES(John,Doe,Lovensdijkstraat 61,Breda,secret,j.doe@server.com)");
      chai
        .request(app)
        .get("/api/user/1")
        .end((err, res) => {
          res.should.be.an("object");
          // console.log(res.Message);
          res.should.have.status(404);

          done();
        });
    });

    it("Get user that does exist", (done) => {
      const query =
        "SET @email = 'j.doe@server.com'; " +
        "INSERT INTO user (`firstName`, `lastName`,`street`,  `city`,  `password`,`emailAdress`) VALUES ('John','Doe','Lovensdijkstraat 61','Breda','secret',@email);" +
        "SELECT id FROM user ";
      let id = "";
      Database.query(query, (err, rows, fields) => {
        id = rows[2][0].id;
      });
      chai
        .request(app)
        .get(`/api/user/${id}`)
        .end((err, res) => {
          res.should.be.an("object");
          // console.log(res.Message);
          res.should.have.status(200);

          done();
        });
    });

    

  });

  describe("get users api/user", () => {
    beforeEach(() => {
      Database.query("DELETE IGNORE FROM meal_participants_user");
      Database.query("DELETE IGNORE FROM  meal");
      Database.query("DELETE IGNORE FROM  user");
    });

    it("Update user that does not exist", (done) => {
      chai
        .request(app)
        .put(`/api/user/1`)
        .send({
          firstName: "John",
          lastName: "Doe",
          street: "Lovensdijkstraat 61",
          city: "Breda",
          password: "secret",
          emailAdress: "j.doe@server.com",
        })
        .end((err, res) => {
          res.should.be.an("object");
          res.should.have.status(404);
  
          done();
        });
    });

    

  });




  
});
