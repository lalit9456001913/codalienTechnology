/************ create mongo connection */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise
url = 'mongodb://localhost:27017/codalienDb';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

/************************* */

const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const schedule = require('node-schedule');
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')
const axios = require('axios').default;
const path = require('path');
/*************manage session */
var session = require('express-session')
/************************** */

/*******import models here */
require('./schemas/allSchema.js')
const otpMonitor = mongoose.model('otpMonitor')
const urlMonitor = mongoose.model('urlMonitor')
/*************************** */


/*****emailHelper for sending email */
const EmailHelper = require('./EmailHelper.js')
/********************************** */
const whitelist = ['http://localhost:3000', 'http://localhost:5000']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'healthstatus',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

/************************ login *****/

app.post('/login',(req,res)=>{
  try{
    let email = req.body.userEmail
    let phoneNumber = req.body.phoneNumber
    let otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    let currentTime = new Date()
    let role = req.body.role
    let expiryTime = currentTime.setMinutes(currentTime.getMinutes()+5);
    let obj;
    console.log('email...',email,'phoneNumber....',phoneNumber)
    if(email==''){
       obj = {
        phoneNumber:phoneNumber,
        otp:otp,
        expiryTime:expiryTime,
        role:role
      }
      console.log(obj)
    }else if(phoneNumber==''){
      obj = {
        email:email,
        otp:otp,
        expiryTime:expiryTime,
        role:role
      }
    }else{
      obj = {
        email:email,
        phoneNumber:phoneNumber,
        otp:otp,
        expiryTime:expiryTime,
        role:role
      }
    }
   
    console.log(obj)
    otpMonitor.findOneAndUpdate({$or:[{email:email},{phoneNumber:phoneNumber}]},obj,{new:true,upsert:true},function(err,updatedDoc){
      if(err){
        throw err
      }
      console.log(updatedDoc)
      EmailHelper.sendOtpOnMail(email,otp,function(error){
          if(error){
            res.send(401)
          }
      })
      EmailHelper.sendOtpOnNumber(phoneNumber,otp,function(err,result){
        if(error){
          res.send(401)
        }
      })
      res.sendStatus(200)
    })
  }catch(e){
    res.json({"error":e})
  }
})

/*****************************/

/******************* logout */
app.get('/Logout', async(req, res) => {
   const sess = req.session;
  sess.destroy(function(err) {
      if (err) {
        throw err
      } else {
       res.status(200).json({"msg":"session destro successfully"})   
      }
  });
})
/*************************** */

/*********** update monitor frequnecy *****/
app.put('/update',(req,res)=>{
  let id=req.body.id
  let frequency=req.body.frequency
  console.log(id,frequency)
  
  try{
    urlMonitor.findOneAndUpdate({_id:id},req.body,{new:true,upsert:true},function(err,result){
      if (err) {
        throw err
      }
      console.log(result)
      res.status(200).json({data:result})
    })
  }catch(e){
    res.json({"error":e})
  }
})
/***************************************** */

/***************** delete monitor url  */
app.delete('/delete',(req,res)=>{
  let urlMonitorObj = req.body.urlMonitorObj
  try{
    urlMonitor.findByIdAndRemove({_id:urlMonitorObj._id},function(err,result){
      if(err){
        throw err
      }
      res.status(200).json({"msg":"deleted"})
    })
  }catch(e){
    res.json({"error":e})
  }
})

/************************************ */

/*************verify otp*************** */
app.post('/verifyOtp',async(req,res)=>{
  let email = req.body.email
  let phoneNumber = req.body.phoneNumber
  let otp = req.body.otp
  try{
    let checkOtp = await otpMonitor.findOne({$and:[{$or:[{email:email},{phoneNumber:phoneNumber}]},{otp:otp}]})
    if(checkOtp){
      req.session['email']=email
      res.status(200).json({"msg":"otp verified successfully"})
    }else{
      res.status(400).json({"msg":"otp does not match"})
    }
  }catch(e){
    res.json({"error":e})
  }
})
/*************************************** */

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 


/***************************** get alldata  */
app.get('/getAllData/:variable',async(req, res) => {
  let variable = req.params.variable
  let phoneNumber;
  let email;
  if(isNumber(variable)){
    phoneNumber=variable
  }else{
    email = variable
  }
  try{
    console.log(email,phoneNumber)
    let getRole = await otpMonitor.findOne({$and:[{$or:[{email:email},{phoneNumber:phoneNumber}]}]})
    let getAllData;
    if(getRole.role=='admin'){
       getAllData = await urlMonitor.find({})
    }else{
       getAllData = await urlMonitor.find({$and:[{$or:[{email:email},{phoneNumber:phoneNumber}]}]})
    }
    res.status(200).json({data:getAllData})
  }catch(e){
    res.status(401).json({"error":e})
  }
})
/**************************************** */

/*********monitor url ********/
app.post('/monitorUrl',async(req,res)=>{
  let jobId = objectId+fre
  let {email,url,frequency,phoneNumber}=req.body
  console.log(email,url,frequency,phoneNumber)
  let updatedObj={
    email:email,
    url:url,
    frequency:Number(frequency),
    phoneNumber:phoneNumber
  }
  try{
    urlMonitor.findOneAndDelete({_id:jobId})
    const job = schedule.scheduleJob(`*/${frequency} * * * * *`, function(){
      console.log('The answer to life, the universe, and everything!');
      axios.get(url)
      .then(function(response){
       updatedObj.status = response.status
       urlMonitor.findOneAndUpdate({$and:[{$or:[{email:email},{phoneNumber:phoneNumber}]},{url:url}]},updatedObj,{new:true,upsert:true},function(err,result){
          if (err) {
            throw err
          }
          io.emit('/sendStatus/' + email, result)
          })
        if(response.status!==200 && response.status!==201){
          EmailHelper.sendMail(email,url,response.status)
        }
      })
    });
    res.status(200).send({"msg":"working fine"})
    }catch (e) {
    res.json({"error":e,"status":401})
   }
})

/********************************** */

/************load all jobs*************/
async function loadAllJobs(){
  console.log('loaing jobs')
  let getAllJob = await urlMonitor.find({})
  for(let i=0;i<getAllJob.length;i++){
    let frequency = getAllJob[i].frequency
    let email = getAllJob[i].email
    let url = getAllJob[i].url
    let phoneNumber = getAllJob[i].phoneNumber
    let updatedObj={
      email:email,
      url:url,
      frequency:Number(frequency),
      phoneNumber:phoneNumber
    }
    const job = schedule.scheduleJob(`*/${getAllJob[i].frequency} * * * * *`, function(){
      console.log('url',email)
      axios.get(url)
      .then(function(response){
       updatedObj.status = response.status
       urlMonitor.findOneAndUpdate({$and:[{$or:[{email:email},{phoneNumber:phoneNumber}]},{url:url}]},updatedObj,{new:true,upsert:true},function(err,result){
          if (err) {
            throw err
          }
          io.emit('/sendStatus/' + email, result)
        })
        if(response.status!==200 && response.status!==201){
          EmailHelper.sendMail(email,url,response.status)
        }
      })

    })
  }
}
loadAllJobs()
/******************************************** */
const port = process.env.PORT || 4000
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})