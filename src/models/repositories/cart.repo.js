'use strict'

const { convertToObjectIdMongoDB } = require("../../utils")
const {cart} = require("../cart.model")

const findCartById = async (cardId) => {
  return await cart.findOne({ _id: convertToObjectIdMongoDB(cardId), cart_state: 'active' }).lean()
}

module.exports = {
  findCartById
}