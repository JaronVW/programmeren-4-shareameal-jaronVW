const chai = require("chai");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const { init } = require("../../src/index");
const app = require("../../src/index");

let database = [];

chai.should();
chai.use(chaiHttp);

describe("Manage users", () => {
  describe("Add user", () => {
    beforeEach(() => {
      database = [];
    });
    init("When a required input is missing, returns valid error", (done) => {
        
        done();
    });
  });
});
