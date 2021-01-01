const mongoose = require('mongoose');


module.exports = mongoose.model('Sample', {
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: false
  }
})