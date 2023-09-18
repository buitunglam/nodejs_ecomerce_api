const { BadRequestError } = require("../core/error.response");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../models/product.model");
const {
  findAllDraftsForshop,
  publishProductByshop,
  findAllPublishForshop,
  unPublishProductByshop,
  searchProductByUser,
  findAllProducts,
  findProduct
} = require("../models/repositories/product.repo");

// defined Factory class to create product
class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = await ProductFactory.productRegistry[type];
    console.log("productClass...", productClass);
    if (!productClass) throw new BadRequestError(`Invalid error Types ${type}`);
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, payload) {
    const productClass = await ProductFactory.productRegistry[type];
    console.log("productClass...", productClass);
    if (!productClass) throw new BadRequestError(`Invalid error Types ${type}`);
    return new productClass(payload).createProduct();
  }

  // query
  static async findAllDraftsForshop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    const listDrafts = await findAllDraftsForshop({ query, limit, skip });
    console.log("query....", { query, listDrafts });
    return listDrafts;
  }

  static async findAllPublishForshop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublish: true };
    const listDrafts = await findAllPublishForshop({ query, limit, skip });
    console.log("query....", { query, listDrafts });
    return listDrafts;
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] });
  }

  // put
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByshop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByshop({ product_shop, product_id });
  }
}

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
  async createProduct(productId) {
    return await product.create({ ...this, _id: productId });
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
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Error create new Electronic");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new product");

    return newProduct;
  }
}

class Furnitures extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Error create new furniture");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new product");

    return newProduct;
  }
}

ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furnitures);

module.exports = ProductFactory;
