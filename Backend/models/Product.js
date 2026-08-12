const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['Furniture', 'Appliances', 'Office'] },
    subCategory: { type: String, required: true },
    images: [{ type: String }],
    rentPrice: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    tenureOptions: [{ type: Number, default: [3, 6, 12] }],
    stock: { type: Number, default: 10 },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    brand: { type: String },
    isFeatured: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    features: [{ type: String }],
    specifications: { type: Map, of: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
