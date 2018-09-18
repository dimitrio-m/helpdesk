const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Department', departmentSchema);
