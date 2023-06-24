"use strict";

const mongoose = require("mongoose");

const connectString = `mongodb+srv://tunglamxm94:Abc123@cluster0.nlootde.mongodb.net/`;

mongoose
  .connect(connectString)
  .then((_) => console.log("connect DB "))
  .catch((err) => console.log(err));

// dev
if(1 === 1){
  mongoose.set('debug', true)
  mongoose.set('debug', {color: true})
}

module.exports = mongoose;