const request = require('request');
const express=require('express')
const nodemailer=require('nodemailer')
const ejs=require('ejs')
const bodyparser=require('body-parser')
const app=express()
require('dotenv').config()

app.set('view engine','ejs')
app.use(express.json())
app.use(express.static('views'))
app.use(bodyparser.urlencoded({extended: false}))

app.get('/',(req,res)=>{
  res.render('../views/index')
})


app.post('/',(req,res)=>{
  const food_item=req.body.food
  //API FROM RAPIDAPI NUTRITION BY API NINJAS
  const url = 'https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition';
  const options = {
    method: 'GET',
    url: url,
    qs: {
      query: food_item
    },
    headers: {
      'X-RapidAPI-Key': process.env.API_KEY,
      'X-RapidAPI-Host': 'nutrition-by-api-ninjas.p.rapidapi.com'
    }
  };
  request(options, function (error, response, body) {
    if (error){
      console.log('API error')
    }
    else{
     var info=JSON.parse(body)
     console.log('API Connected')
      res.render('../views/output',{data:info[0]})
    }
  });
})


app.get('/email',(req,res)=>{
  // res.sendFile(__dirname + '/views/email.html');
  res.render('../views/email')
})


app.post('/email',(req,res)=>{
  var sender_mail=req.body.mail_sender
  var sender_info=req.body.info
 
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSKEY_MAIL
    },
  });

  const mailOptions ={
    from : sender_mail,
    to :"saikarthikeya066@gmail.com",
    subject :'just for fun',
    text: sender_info
  };

  transport.sendMail(mailOptions,function(err,info){
    if(err){
      console.log('Mail Error')
    }
    else{
      res.render('../views/email',{data:'Report Sent'})
      console.log('Sent'+info.response)
    }
  });
})

app.listen(3000,function(err){
  if(!err){
    console.log('Server Running')
  }
  else{
    console.log('error')
  }
})
