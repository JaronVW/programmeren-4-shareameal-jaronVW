describe("update users api/user", () => {
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

  it("Update user that does exist", (done) => {
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
      .put(`/api/user/${id}`)
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
