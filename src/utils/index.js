"use strict";
const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongoDB = (id) => Types.ObjectId(id);

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

// ["a", "b"] -> {a: 1, b:1}
const getSelectData = (select = []) => {
  const dataFormat = Object.fromEntries(select.map((el) => [el, 1]));
  console.log("select...", dataFormat);
  return dataFormat;
};

const unGetSelectData = (select = []) => {
  const dataFormat = Object.fromEntries(select.map((el) => [el, 0]));
  console.log("unselect...", dataFormat);
  return dataFormat;
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    console.log("obj[k]...", obj[k]);
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  console.log("obj...", obj);
  Object.keys(obj || {}).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  console.log("final...", final);

  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongoDB
};
