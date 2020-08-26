const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userId:String,
    name:String,
    password:String,
    email:String,
    phone:String,
    e_verified:Boolean,
    p_verified:Boolean
})
module.exports = mongoose.model('user',userSchema,'users');