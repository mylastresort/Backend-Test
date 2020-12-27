const express=require( 'express');
const mongoose=require( 'mongoose');
const dotenv=require( 'dotenv/config.js');
const { v4: uuidv4 } = require('uuid');
const Sample=require('../models/SampleSchema.js')

const router=express.Router();

mongoose.connect(process.env.DB_CONNECTION, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
.then(console.log('Connected to Mongoo DataBase!!'))
.catch(err =>console.log(err))


function check(element){
  const {title,price,date,description}=element;
  if(!!title && !!price && !!date){
    if(!description){
      return {title,price,date}
    }
    return {title,price,date,description}
  }
  return 'some fields are missing!!'
}


router.route('/:id')
.get(async function(req,res){
  try {
    const productRequested=await Sample.findById(req.params.id)
    res.send(productRequested)
  } catch (error) {
    res.json({message:error})
  }
})    //*Return a specific product listing. ✓
.delete(async function(req,res){
  try {
    const deletedProduct=await Sample.findById(req.params.id)
    await Sample.deleteOne({_id:req.params.id})
    res.send(`${deletedProduct.title} was deleted`)
  } catch (error) {
    res.json({message:error})
  }
})   //*Delete an existing product listing. ✓
.patch(async function(req,res){
  const {title,price,date,description}=req.body
  const values={title,price,date,description}
  if(!(check(values) instanceof String)){
    console.log(check(values));
    try {
      await Sample.updateOne(
        {_id:req.params.id},
        {
          $set:{title:check(values).title,
            price:check(values).price,
            date:check(values).date,
            description:null || check(values).description
          }
        }
        )
        const updated=await Sample.findById(req.params.id)
        res.send(`${updated.title} was updated`)
    } catch (error) {
      if(error.path==="date"){
        res.send('the date format should be like this : year-month-day')
      }else if(error.path==="price"){
        res.send('the price must be a number')
      }else{
        res.json({message:error})
      }
    }
  }else{res.send(check(values))}
})    //*Update an existing product listing. ✓



router.route('/')
.get(async function(req,res){
  try {
    if(!!req.query.n){
      const givenNumber=parseInt(req.query.n);
      Requested=await Sample.find().limit(givenNumber)
      res.send(Requested)
      return;
      //*Return a given number of listings, for example n = 10. This number will be different depending on requests and should be passed in a query string. ✓
    }
    let prices=[]
    for await (const e of Sample.find()){prices.push(e.price)}
    res.json({
      Products:await Sample.find().countDocuments(),
      cheapestProduct:Math.min(...prices),
      overPricedProduct:Math.max(...prices)
    })      //*Return statistics on the API, like how many listings are in the database. ✓

  } catch (error) {
    res.json({message:error})
  }
})
.post(async function(req,res){
  const {title,price,date,description}=req.body
  const values={title,price,date,description}
  if(!(check(values) instanceof String)){
    const product=new Sample({...values, id:uuidv4()})
    try {
      await product.save()
      res.send(`${title} was created`)
    } catch (error) {
      if(error.path==="date"){
        res.send('the date format should be like this : year-month-day')
      }else if(error.path==="price"){
        res.send('the price must be a number')
      }else{
        res.json({message:error})
      }
    }
  }else{res.send(check(values))}
})    //*Create a new product listing. ✓




module.exports= router;