const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    require: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    require: true
  },
  createdAt: {
    type: String,
    default: Date.now
  }
});


module.exports = mongoose.model('User', userSchema);
