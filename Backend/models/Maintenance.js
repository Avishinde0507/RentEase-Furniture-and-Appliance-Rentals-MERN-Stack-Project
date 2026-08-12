const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  product: { type: String, required: true },
  issue: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: String, required: true },
  visitDate: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
