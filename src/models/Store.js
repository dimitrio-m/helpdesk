const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  ip_pc: {
    type: String,
    required: true,
  },
  ipvpn: {
    type: String,
  },
  created: { 
    type: Date, 
    default: Date.now 
  }, 
});

module.exports = mongoose.model('Store', storeSchema);
