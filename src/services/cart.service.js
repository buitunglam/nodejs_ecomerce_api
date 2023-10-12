"use strict";

const { max } = require("lodash");
const { BadRequestError, NotFoundError } = require("../core/error.response");

const { cart } = require("../models/cart.model");
const { convertToObjectIdMongoDB } = require("../utils");
const {
  updateDiscountById,
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
} = require("../models/repositories/disocunt.repo");
const {
  findAllProducts,
  getProductById,
} = require("../models/repositories/product.repo");

/**
 * Key feature: Cart service
  - add to cart
  - reduce product quantity by one [user]
  - increase quantity by one [user]
  - get cart [user]
  - delete cart [user]
  - delete cart item [user]
 */

class CartService {
  // START REPO CART
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    console.log("updateOrInsert cart......", query);

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { quantity, productId } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };
    console.log("updateOrInsert cart......", query);

    return await cart.findOneAndUpdate(query, updateSet, options);
  }
  // END REPO CART

  static async addToCart({ userId, product = {} }) {
    // check cart exist or not
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      // create cart for user
      return await CartService.createUserCart({ userId, product });
    }

    // Nếu có giỏ hàng rồi nhưng chưa có sản phẩm
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // Giỏ hàng tồn và sản phẩm này có thỉ update số lượng sản phẩm đó
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  // update cart
  /*
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
            quantity,
            price, 
            shopId,
            old_quantity,
            productId
          }
        ],
        version
      }
    ]
  */
  static async addToCartV2({ userId, shop_order_ids }) {
    console.log("shop_order_ids....", shop_order_ids);
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    // check product
    const found_product = await getProductById(productId);
    if (!found_product) throw new NotFoundError("");

    // compare
    if (found_product.product_shop.toString() !== shop_order_ids[0].shopId) {
      throw new NotFoundError("Product do not being to the shop");
    }

    if (quantity == 0) {
      // delete product
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getlistUserCart({ userId }) {
    return await cart.findOne({ cart_userId: userId }).lean();
  }
}

module.exports = CartService;
