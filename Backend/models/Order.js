const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  product: { type: String, required: true },
  amount: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: String, required: true },
  tenure: { type: String },
  extensionTenure: { type: String },
  deliveryDate: { type: String },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentId: { type: String },
  location: {
    lat: Number,
    lng: Number
  },
  items: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
