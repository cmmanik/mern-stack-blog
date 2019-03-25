const mongoose = require('mongoose');

const { Schema } = mongoose;
// create user schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    data: {
        type: Date,
        default: Date.now,
    },
});
const User = mongoose.model('users', UserSchema);
module.exports = User;
