var nodemailer = require('nodemailer');
const fast2sms = require('fast-two-sms')
require('dotenv').config()
let YOUR_API_KEY="r86Kf2YsDxX7JMpweFES0g5ztomua4Hj3UGRyk9VnclWiqAPbQDnXO4P0E2ckuHaRpfUbN9jdQ5vGtxL"

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: process.env.email,			//email ID
	    pass: process.env.password				//Password 
    }
});

const sendOtpOnMail=(email,otp)=>{
    var details = {
        from: process.env.email, // sender address same as above
        to: email, 					// Receiver's email id
        subject: 'Your login OTP is ', // Subject of the mail.
        html: otp					// Sending OTP 
    };

    transporter.sendMail(details, function (error, data) {
        if(error)
            console.log(error)
        else
            return data;
     });
}
const sendMail=(email,url,status)=>{
    var details = {
        from: process.env.email, // sender address same as above
        to: email, 					// Receiver's email id
        subject: 'Your demo OTP is ', // Subject of the mail.
        html: `${url} has ${status}`					// Sending OTP 
    };

    transporter.sendMail(details, function (error, data) {
        if(error)
            console.log(error)
        else{
            console.log(data);
            return data.response
        }
    });
}

const sendOtpOnNumber=(phoneNumber,otp)=>{
    let options={authorization : YOUR_API_KEY , message : `your login otp is ${otp}` ,  numbers : [process.env.phoneNumber,phoneNumber]}
    fast2sms.sendMessage(options).then(response=>{
        console.log(response)
        return
    })
}
					
module.exports = {sendMail,sendOtpOnMail,sendOtpOnNumber}
