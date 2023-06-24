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

module.exports = app;
