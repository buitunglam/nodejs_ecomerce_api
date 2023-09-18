"use strict";
const _ = require("lodash");

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

// ["a", "b"] -> {a: 1, b:1}
const getSelectData = (select = []) => {
  const dataFormat = Object.fromEntries(select.map((el) => [el, 1]));
  console.log("select...",dataFormat);
  return dataFormat
};

const unGetSelectData = (select = []) => {
  const dataFormat =  Object.fromEntries(select.map((el) => [el, 0]));
  console.log("unselect...",dataFormat);
  return dataFormat
};

module.exports = { getInfoData, getSelectData, unGetSelectData };
