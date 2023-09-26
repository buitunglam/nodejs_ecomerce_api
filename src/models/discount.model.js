"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const DiscountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" }, // percenttage
    discount_value: { type: Number, required: true }, // 10.0000, 10
    discount_code: { type: String, required: true }, // discount code
    discount_start_date: { type: Date, required: true }, // start date
    discount_end_date: { type: Date, required: true }, // end date
    discount_max_uses: { type: Number, required: true }, // Số lượng discount được áp dụng
    discount_uses_count: { type: Number, required: true }, // Số discount đã sử dụng
    discount_users_used: { type: Array, default: [] }, // Ai đã sử dụng
    discount_max_uses_per_user: { type: Number, required: true }, // Số lượng cho phép sử dụng tối đa của 1 user
    discount_max_value: { type: Number, required: true },
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applie_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] }, // Số sản phẩm được áp dụng
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  discount: model(DOCUMENT_NAME, DiscountSchema),
};
