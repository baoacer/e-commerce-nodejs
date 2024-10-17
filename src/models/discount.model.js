"use strict";

const {Schema, model, Types} = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema({
    discount_name: { type: String, requierd: true },
    discount_description: { type: String, requierd: true },
    discount_type: { type: String, default: 'fixed_amount' }, //percentpage
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true }, // number of discount code can be used
    discount_uses_count: { type: Number, required: true }, // number of discount code used
    discount_users_used: { type: Array, default: [] }, // users who used discount code
    discount_max_uses_per_user: { type: Number, required: true }, // number of discount code can be used by one user
    discount_min_order_value: { type: Number, required: true }, 
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    
    discount_is_active: { type: Boolean, default: true }, 
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] }, 
    discount_product_ids: { type: Array, default: [] }, 
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
