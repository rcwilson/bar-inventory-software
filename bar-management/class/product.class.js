const mongoose = require('mongoose');
const User = require('./user.class');
const { Schema } = mongoose;
const ProductSchema = new Schema({
    name: {type: String, required: true},
    category: String,
    unit: String,
    package_units: Number,
    package_type: String,
    package_price: Number,
    distributor: String,
    created_by: { type: Schema.Types.ObjectId, ref: User.modelName }
}, { timestamps: true, bufferCommands: false, autoCreate: false, collection: "products" })

module.exports = mongoose.model("Product", ProductSchema)
