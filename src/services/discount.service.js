"use strict";

const { max } = require("lodash");
const { BadRequestError, NotFoundError } = require("../core/error.response");
/**
 * Discount service
  1. Generator discount code [Shop|Admin]
  2. Get discount amount [User]
  3. Get all discount code [user]
  4. Verify discount code [user]
  5. Delete discount code [Admin|shop]
  6. Cancel discount code [user]
 */

const { discount } = require("../models/discount.model");
const { convertToObjectIdMongoDB } = require("../utils");
const {
  updateDiscountById,
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
} = require("../models/repositories/disocunt.repo");
const { findAllProducts } = require("../models/repositories/product.repo");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      users_used,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;
    // Kiem tra
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.is_active) {
      throw BadRequestError("Discount exist!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applie_to: applies_to,
      discount_product_ids: applies_to == "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode(payload) {
    const { _id, bodyUpdate } = payload;
    return await updateDiscountById(
      _id,
      removeUndefinedObject(bodyUpdate),
      discount
    );
  }

  /*
  Get all discount codes available with products for user
  */

  static async getAllDiscountCodesWithProducts({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create index for discount code
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoDB(shopId),
    });

    console.log("foundDiscount...", foundDiscount);

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("discount not exist!");
    }

    const { discount_applie_to, discount_product_ids } = foundDiscount;
    let products;

    if (discount_applie_to == "all") {
      // get all product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongoDB(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applie_to == "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          product_shop: convertToObjectIdMongoDB(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    console.log("products....", products);

    return products;
  }

  /*
  Get all discount codes available with products for shop
  (Dùng khi bấm voà 1 code discount sẽ ra tất cả những sản phẩm của dùng được code đó)
  */
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limmit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongoDB(shopId),
        discount_is_active: true,
      },
      unselect: ["__v", "discount_shopId"],
      model: discount,
    });

    return discounts;
  }

  /*
  Apply discount code 
  products = [
    {
      productId,
      shopId, quantity, name, price
    }
  ]
  */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError(`discount dosen't exist`);

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError("discount expired");
    if (!discount_max_uses) throw new NotFoundError("discount are out");
    // if (new Date() < new Date(discount_start_date))
    //   throw new NotFoundError("discount code are not ready");
    if (new Date(discount_start_date) >= new Date(discount_end_date))
      throw new NotFoundError("Start date must be before end date");

    console.log("foundDiscount....", products);

    // Check xem có giá trị hay không
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
    }

    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUseDiscount) {
        // throw new NotFoundError("discount already being use")
      }
    }

    // check xem discount này là fixed_amount hay percentage
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : (totalOrder * discount_value) / 100;

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findByIdAndDelete({
      discount_code: codeId,
      discount_shiopId: shopId,
    });

    return deleted;
  }

  /*
  user cancel
  */

  static async cancelDiscount({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("discount dosen't exist");

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
  }
}

module.exports = DiscountService;
