"use strict";

const mongoose = require("mongoose");
const { app, db } = require("../configs/config.mongodb");
console.log('db....', db);
const connectString = db.uri;
const { countConnection } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongoDb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then(() => console.log("connect mongo db PRO", countConnection()))
      .catch((err) => console.log(err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
