const mongoose = require('mongoose');
const ProductSchema=new mongoose.Schema({
    name:String,
    brand:String,
    model:String,
    category:String
})
 module.exports= mongoose.model('product',ProductSchema)