"use strict";

const { Types } = require("mongoose");
const { getSelectData, unGetSelectData } = require("../../utils");
const { inventory } = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventory.create({
    invent_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

module.exports = {
  insertInventory,
};
