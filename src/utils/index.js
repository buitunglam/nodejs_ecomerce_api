"use strict";
const _ = require("lodash");

const getInfoData = ({fileds = [], object = {}}) => {
  console.log('aaaaa', object, fileds);
  return _.pick(object, fileds);
};

module.exports = { getInfoData };
