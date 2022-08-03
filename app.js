require("dotenv").config();

const express = require("express"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  morgan = require("morgan"),
  app = express(),
  DB_URI = process.env.DB_URI,
  DB_USERNAME = process.env.DB_USERNAME,
  DB_PASSWORD = process.env.DB_PASSWORD,
  ATLASURI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URI}?retryWrites=true&w=majority`,
  HOST = process.env.HOST,
  PORT = process.env.PORT || 5000,
  productsRouter = require("./api/products"),
  usersRouter = require("./api/users"),
  authorRouter = require("./api/authors");
mongoose.connect(ATLASURI, (err) => {
  if (!err) return console.log(`Connected to Atlas DB.`);
  console.error(err);
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/authors", authorRouter);
app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}`);
});
