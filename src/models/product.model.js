"use strict";

const { type } = require("express/lib/response");
const { model, Schema } = require("mongoose");
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = `Product`;
const COLLECTION_NAME = `Products`;

const ProductSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_slug: { type: String }, // seo, ex: quan-jean-cao-cap
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ["Electronic", "Clothing", "Furniture"] },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: { type: Number, default: 4.5, 
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10  //set: setter biến đổi value trước khi save to db
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

/**
 * @desc Create 'index' for 'search'
 */
ProductSchema.index({ product_name: "text", product_description: "text" });

/**
 * @desc Document middleware runs before save() and create()
 * Auto convert product_name to product_slug.
 * Ex: quan jean cao cap -> quan-jean-cao-cap
 */
ProductSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// define the product type = clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" }
  },
  {
    collection: "Clothes",
    timestamps: true,
  }
);

// define the product type = electronic
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" }
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);

// define the product type = furniture
const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" }
  },
  {
    collection: "Furnitures",
    timestamps: true,
  }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, ProductSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronic", electronicSchema),
  furniture: model("Furniture", furnitureSchema),
};
