const mongoose =require('mongoose');
const productschema = new mongoose.Schema({
    productId: String,
    name:{type:String , required:true},
    description:String,
    price:{type:Number , required:true},
    category:{type:String , required:true},
    stock:{type:Number , required:true},
    warranty:Number,
    image:String,
    color:String,
    size:String,
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isRecommended: { type: Boolean, default: false },
    note_coeur: { type: Number, default: 0 },
    sentimentScore: { type: Number, default: 0 },
    recommendationRank: { type: Number, default: 0 },
    lastRecommendationUpdate: Date,
    isAvctive:{type:Boolean , default:true}
});
module.exports = mongoose.model('Product', productschema);
