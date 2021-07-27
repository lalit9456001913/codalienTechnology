const mongoose = require('mongoose')
var mongooseTypePhone = require('mongoose-type-phone');
var urlMonitor = mongoose.Schema({
    email: String,
    phoneNumber:{ type: mongoose.SchemaTypes.Phone, allowBlank: true },
    url: String,
    frequency: Number,
    status: Number
    
});
var otpMonitor = mongoose.Schema({
    email:String,
    phoneNumber:String,
    otp:String,
    expiryTime:Number,
    role:{type:String,default:"normal"}
})

module.exports =mongoose.model('urlMonitor', urlMonitor);
module.exports = mongoose.model('otpMonitor',otpMonitor)