const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const userRouter = require("./routes/user-router");

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Share a meal app",
  });
});

app.use("/api/user", userRouter);

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});

app.use((err, req, res) => {
  res.status(err.status).json(err);
});


app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});


module.exports = app;