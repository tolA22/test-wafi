const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    balance: { type: Number, required: false, default: 0 },
    accountNumber: { type: Number, required: true, unique: true }
});

module.exports = mongoose.model('user', userSchema)