"use strict";

const { Types } = require("mongoose");
const {
  product,
  electronic,
  furniture,
  clothing,
} = require("../../models/product.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const findAllDraftsForshop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForshop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isDraft: false,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const publishProductByshop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublish = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByshop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublish = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(50)
    .select(getSelectData(select))
    .lean();

  return products;
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew
  })  
} 

const findProduct = async ({ product_id, unSelect }) => {
  const products = await product
    .findById(product_id)
    .select(unGetSelectData(unSelect));

  return products;
};

module.exports = {
  findAllDraftsForshop,
  publishProductByshop,
  unPublishProductByshop,
  findAllPublishForshop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById
};
