const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = `Key`;
const COLLECTION_NAME = `Keys`;

const keyTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Shop",
  },
  publicKey: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  refreshTokensUsed: {
    type: Array,
    default: [],
  }
},{
  timestamps: true,
  collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
