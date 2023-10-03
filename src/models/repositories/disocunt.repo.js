"use strict";

const { Types } = require("mongoose");
const { unGetSelectData } = require("../../utils");

const updateDiscountById = async ({
  discountId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(discountId, bodyUpdate, {
    new: isNew,
  });
};

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter,
  unselect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(50)
    .select(unGetSelectData(unselect))
    .lean();

  return documents;
};

const findAllDiscountCodesSelect = async ({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter,
    select,
    model,
  }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const documents = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(50)
      .select(unGetSelectData(select))
      .lean();
  
    return documents;
  };

const checkDiscountExist = async ({model, filter}) => {
  return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodesSelect,
    findAllDiscountCodesUnSelect,
    checkDiscountExist
};
