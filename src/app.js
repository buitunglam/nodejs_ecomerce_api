require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const helmet = require('helmet');
const compression = require("compression");
const app = express();
const routerTest = require('./routes/index');
// init middleware
app.use(morgan("dev"));
app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({
  extends: true
}));



const {checkOverload} = require('./helpers/check.connect');
checkOverload();
// init db
require("./dbs/init.mongodb")
// init routers
app.use('/', routerTest);

// handle errors
app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server error'
  })
})

module.exports = app;
