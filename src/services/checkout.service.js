"use strict";

const { BadRequestError } = require("../core/error.response");
const { product } = require("../models/product.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductById } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  /*
  payload from client
  {
    cartId,
    userId,
    shop_order_ids: [
      {
        shopId,
        shop_order_ids: [
          {
            shopId, 
            shop_discounts: [],
            item_product: [
              {
                price,
                quantity,
                productId
              }
            ]
          },
          {
            shopId, 
            shop_discounts: [
              {
                shopId,
                discountId,
                codeId
              }
            ],
            item_product: [
              {
                price,
                quantity,
                productId
              }
            ]
          }

        ]
      }
    ]
  }
  */

  static async checkoutReview({
    cartId, userId, shop_order_ids = []
  }) {
    console.log("cartId....", cartId, userId, shop_order_ids);
    // check cartId exist
    const foundCart = await findCartById(cartId)
    console.log("foundCart....", foundCart);
    if (!foundCart) throw new BadRequestError('Cart dose not exist!')

    const checkout_order = {
      totalPrice: 0, // tong tien hang
      feeShip: 0, // phi van chuyen
      totalDIscount: 0, //tong tien discount giam gia
      totalCheckout: 0, // tong thanh toan
    }, shop_order_ids_new = []

    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
      // check product available
      const checkProductServer = await checkProductById(item_products);
      console.log("checkProductServer...", checkProductServer);

      // tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      // tong tien trước khi xử lý
      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      console.log("shop_discounts....", shop_discounts);
      // Nếu shopDiscount tồn tại > 0, check xem có hợp lệ hay ko
      if (shop_discounts.length > 0) {
        // gỉa sử chỉ có 1 discount
        // get all discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId: shop_discounts[0].shop_id,
          products: checkProductServer
        })

        // tổng cộng discount giảm giá
        checkout_order.totalDIscount += discount

        // nếu tiền giảm giá lớn hơn 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }

        // Tổng thanh toán cuối cùng
        checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
        shop_order_ids_new.push(itemCheckout)
      }

    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }

  }
}

module.exports = CheckoutService;