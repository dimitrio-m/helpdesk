const mongoose = require('mongoose');
const autoIncrement = require('mongoose-plugin-autoinc');
const mongoosePaginate = require('mongoose-paginate');
const config = require('../config');


const connection = mongoose.createConnection(config.db.url);

autoIncrement.initialize(connection);

const ticketSchema = mongoose.Schema({
  assigned_to: {
    type: String,
    required: true,
  },
  from: {
    name: {
      type: String,
      required: true,
    },
    store: {
      type: String,
      required: true,
    },
  },
  department: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cellphone: {
    type: String,
  },
  cc: [{
    type: String,
  }],
  created: {
    type: Date, 
    default: Date.now,
  },
  comments: [{
    author: {
      type: String,
      required: true,
    },
    timestamp: { 
      type: Date, 
      default: Date.now, 
    },
    content: {
      type: String,
    },
    category: {
      type: String,
    }
  }],
  log: [{
    timestamp: { 
      type: Date, 
      default: Date.now,
    },
    author: {
      type: String,
    },
    content: {
      type: String,
    },
  }],
}, 
{
  usePushEach: true
});

ticketSchema.plugin(autoIncrement.plugin, 'Ticket');
ticketSchema.plugin(mongoosePaginate, 'Ticket');

module.exports = mongoose.model('Ticket', ticketSchema);
