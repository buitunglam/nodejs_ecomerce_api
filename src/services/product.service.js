const { BadRequestError } = require("../core/error.response");
const { product, electronic, clothing } = require("../models/product.model");

// defined Factory class to create product
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronics":
        return new Electronics(payload);
      case "Clothing":
        return new Clothing(payload);
      default:
        return new BadRequestError(`Invalid Product type ${type}`);
    }
  }
}

/*
  product_name: { type: String, require: true },
  product_thumb: { type: String, require: true },
  product_description: String,
  product_price: {type: Number, require: true},
  product_quantity: {type: Number, require: true},
  product_type: {type: String, require: true, enum: ["Electronics", "Clothing", "Furniture"]},
  product_shop: {type: Schema.Types.ObjectId, ref: "Shop"},
  product_attribute: {type: Schema.Types.Mixed, require: true},
*/

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attribute,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attribute = product_attribute;
  }

  // create new product
  async createProduct() {
    console.log("create product in product...");
    return await product.create(this);
  }
}

// defined sub class  for differnce product type clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attribute);
    if (!newClothing) throw new BadRequestError("Create new Clothing error");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error");
    return newProduct;
  }

}

// defined sub class  for differnce product type electronic
class Electronics extends Product {
  async onCreateProduct() {
    const newElectronic = await electronic.create(this.product_attribute);
    if (!newElectronic)
      throw new BadRequestError("Error create new Electronic");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product");

    return newProduct;
  }
}

module.exports = ProductFactory;
