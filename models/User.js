'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
});

userSchema.statics.hashPassword = function (passwordNoEncrypt) {
  return bcrypt.hash(passwordNoEncrypt, 10);
};

userSchema.methods.comparePassword = function (passwordNoEncrypt) {
  return bcrypt.compare(passwordNoEncrypt, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
