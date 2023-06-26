"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "ApiKey";
const CONECCTION_NAME = "ApiKeys";

// Declare the schema of the mongo model
const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      require: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      require: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: CONECCTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, apiKeySchema);
