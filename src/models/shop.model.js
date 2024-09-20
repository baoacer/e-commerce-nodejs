"use strict";

// !dmbg : generate schema
const { model, Schema, Types, SchemaType, Collection } = require("mongoose");

const DOCUMENT_NAME = `Shop`;
const COLLECTION_NAME = `Shops`;

var ShopSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxLength: 150,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  verfify: {
    type: Schema.Types.Boolean,
    default: false,
  },
  roles: {
    type: Array,
    default: [],
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, ShopSchema);
