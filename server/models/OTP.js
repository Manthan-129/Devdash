const mongoose= require('mongoose');

const OTPSchema= new mongoose.Schema({
    email: {type: String, required: true, trim: true, lowercase: true},
    otp: {type: String, required: true},
    expiresAt: {type: Date, index: {expires: 0}, required: true},
},{timestamps: true});

module.exports= mongoose.model('OTP', OTPSchema);