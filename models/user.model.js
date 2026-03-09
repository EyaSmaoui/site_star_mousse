const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userschema = new mongoose.Schema({
    // If a username is not provided (e.g., when creating an admin), default to the email.
    username: { type: String, required: true, default: function() { return this.email; } },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    phone: Number,
    location:String,
    photo:String,
     //admin
    permission:String,
    logs:String,

    
    panier: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', unique: true },//one to one
    reviews: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },//one to many
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },//one to many
});

userschema.pre('save',async function(){
    //hash the password before saving the user
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userschema.statics.Login = async function(email,password){
    const user = await this.findOne({email});
    if(!user){
        throw new Error('user not found');
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error('invalid password');
    }
    return user;
};
    
module.exports = mongoose.model('User', userschema);
