const mongoose= require('mongoose');
module.exports.connectToMongoDB = async () => {  
  mongoose.connect(process.env.url_Mongodb).then(() => {
    console.log('connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
 });
};