const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const port = process.env.PORT;

const userRouter = require("./routes/user-router");
const authRouter = require("./routes/auth-router");
const mealRouter = require("./routes/meal-router")

// app.all("*", (req, res, next) => {
//   const method = req.method;
//   console.log(`Method ${method} is aangeroepen`);
//   next();
// });

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Share a meal app",
  });
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/meal", mealRouter);

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});

app.use((err, req, res) => {
  console.log("hier")
  res.status(err.status).json(err);
});



app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});

process.on('warning', (warning) => {
  console.log(warning.stack);
});

module.exports = app;
