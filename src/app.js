const express = require("express");
const morgan = require("morgan");
const helmet = require('helmet');
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet())
// app.use(compression())
// init db

// init routers
app.get("/", (req, res, next) => {
  const strCompress = 'Hello 10.000 time'
  return res.status(200).json({
    message: "welcome tipjs",
    metadata: strCompress.repeat(100000)
  });
});
// handle errors

module.exports = app;
