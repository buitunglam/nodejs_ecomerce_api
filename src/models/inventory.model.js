"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const InventorySchema = new Schema(
  {
    invent_productId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Product",
    },
    inven_location: {
      type: String,
      default: "unKnow"
    },
    inven_stock: {
      type: Number,
      require: true,
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    inven_stock: {
      type: Number,
      require: true,
    },
    inven_reservations: {
      type: Array,
      default: []
    },
    /*
      cardId,
      stock:1,
      createOn 
     */
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  inventory: model(DOCUMENT_NAME, InventorySchema)
};
