const controller = {
  addMovie: (req, res) => {
    const user = req.body;
    const emailAdress = req.body.emailAdress;

    if (emailAdress != null) {
      if (
        database.filter((item) => item.emailAdress == emailAdress).length > 0
      ) {
        res.status(400).json({
          Status: 400,
          Message: `A user with this Email adress already exists!`,
        });
      } else {
        databaseID++;
        database.push({
          id: databaseID,
          ...user,
        });
        res.json(database.filter((item) => item.emailAdress == emailAdress));
      }
    } else {
      res.status(400).json({
        Status: 400,
        Message: `body does not emailAdress field`,
      });
    }
  },
  getMovies: (req, res) => {
    const userID = req.params.userId;
    const selectedUser = database.filter((item) => item.id == userID);
    if (selectedUser.length > 0) {
      res.send(database[userID]);
    } else {
      res.status(400).json({
        Status: 400,
        Message: `user not found`,
      });
    }
  },
};


module.exports = controller;
