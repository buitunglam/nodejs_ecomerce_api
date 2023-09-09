"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema({
  product_name: { type: String, require: true },
  product_thumb: { type: String, require: true },
  product_description: String,
  product_price: {type: Number, require: true},
  product_quantity: {type: Number, require: true},
  product_type: {type: String, require: true, enum: ["Electronics", "Clothing", "Furniture"]},
  product_shop: {type: Schema.Types.ObjectId, ref: "Shop"},
  product_attribute: {type: Schema.Types.Mixed, require: true},
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

// defined product type = clothing
const clothingSchema = new Schema({
  brand: {type: String, require: true},
  size: String,
  material: String
}, {
  collection: 'clothings',
  timestamps: true  
})

// defined product type = electronics
const electronicSchema = new Schema({
  manufacturer: {type: String, require: true},
  model: String,
  color: String
}, {
  collection: 'electronic',
  timestamps: true
});

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicSchema),
  clothing: model('Clothing', clothingSchema)
}