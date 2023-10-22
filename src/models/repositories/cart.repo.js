'use strict'

const { convertToObjectIdMongoDB } = require("../../utils")
const cartModel = require("../cart.model")

const findCartById = async (cardId) => {
  return await cartModel.findOne({ _id: convertToObjectIdMongoDB(cardId), cart_state: 'active' }).lean()
}

module.exports = {
  findCartById
}