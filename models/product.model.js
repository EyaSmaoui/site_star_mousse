const mongoose =require('mongoose');
const productschema = new mongoose.Schema({
    name:{type:String , required:true},
    description:String,
    price:{type:Number , required:true},
    category:{type:String , required:true},
    stock:{type:Number , required:true},
    warranty:Number,
    image:String,
    color:String,
    size:String,
    isAvctive:{type:Boolean , default:true}
});
module.exports = mongoose.model('Product', productschema);
