const express=require( 'express');
const mongoose=require( 'mongoose');
const { v4: uuidv4 } = require('uuid');
const dotenv=require( 'dotenv/config.js');
const Sample=require('../models/SampleSchema.js')
const MongoClient = require('mongodb').MongoClient;
const { collection } = require('../models/SampleSchema.js');
const client = new MongoClient(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true});

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
function sum(...e){
  let sum=0
  for (const i of e) {
    sum+=i
  }
  return sum
}
function getTheFeed(list){
  return {
    first:{
      title:list[0].title,
      description:list[0].description || 'empty',
      price:list[0].price
    },
    second:{
      title:list[1].title,
      description:list[1].description || 'empty',
      price:list[1].price
    },
    third:{
      title:list[2].title,
      description:list[2].description || 'empty',
      price:list[2].price
    },
  }
}
function getAverage(list,type){
  let sum=0
  if(type==='day'){
    for (const i in list){
      if(list[i].date.getDate()===new Date().getDate()){
        sum+=1
      }else{
        return sum
      }
    }
  }else if(type==='week'){
    let sum=0
    seventhday=new Date().getDay()
    for (const key in list){
      if(list[key].date.getDate()>=seventhday){
        sum++
      }
    }
    return Number.parseFloat(sum/7).toFixed(2)
  }else if(type==='ceiling'){
    let index=0
    let weekdata=new Array()
    let lastsunday=list[0].date.getDate()-new Date().getDay()
    for (const e in list){
      if(list[index].date.getDate()>lastsunday){
        index++
      }else{
        break
      }
    }
    for(let i=0;i<7;i++){
      let sum=0
      if(list[index].date.getDate()===lastsunday){
        while(list[index].date.getDate()===lastsunday){
          sum++
          index++
          if(list[index]===undefined){
            weekdata.push(sum)
            return weekdata
          }
        }
      }else if(list[index]===undefined){
        return weekdata
      }else{
        index++
      }
      lastsunday--
      weekdata.push(sum)
    }
    return weekdata
  }
}
function findTheDay(element){
  let day=new Array()
  let max=Math.max(...element)
  for (const s in element){
    if(element[s]===max){
      day.push(s)
    }
  }
  let g=[]
  for (const i of day) {
    switch (i) {
      case '1':
        g.push('Sunday')
        break;
      case '6':
        g.push('Monday')
        break;
      case '5':
        g.push('Tuesday')
        break;
      case '4':
        g.push('Wednsday')
        break;
      case '3':
        g.push('Thursday')
        break;
      case '2':
        g.push('Friday')
        break;
      case '0':
        g.push('Saturday')
        break
    }
  }
  if(!!g.length){
    return g[0]
  }else{
    return g
  }
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
    try {
      await Sample.updateOne(
        {_id:req.params.id},
        {$set:{
          title:check(values).title,
          price:check(values).price,
          date:check(values).date
        }}
        )
        if(!!check(values).description){
          await Sample.updateOne(
            {_id:req.params.id},
            {$set:{description:check(values).description}}
          )
        }
        const updated=await Sample.findById(req.params.id)
        res.send(`${updated.title} was updated`)
    }catch(error){
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
    let posts=0
    for await (const e of Sample.find()){prices.push(e.price)}
    client.connect(async err => {
      const collection = client.db("Cluster0").collection("samples");
      const {size,storageSize}=await collection.stats()
      res.json({
        totalPosts:await Sample.find().countDocuments(),
        cheapestProduct:Math.min(...prices),
        overPricedProduct:Math.max(...prices),
        averagePrice:Math.floor(sum(...prices)/await Sample.find().countDocuments()),
        todaysposts:getAverage((await Sample.find()).reverse(),'day'),
        postingsAverage7daysAgo:getAverage((await Sample.find()).reverse(),'week'),
        postingTracker:{
          theceilingOfTheLastWeek:findTheDay(getAverage((await Sample.find()).reverse(),'ceiling')),
          removedPosts:'',
          lifetimePosts:''
        },
        DB_size:{
          usedSize:`${size} Bytes`,
          freeStorageSize:`${storageSize-size} Bytes`
        },
        lastPosts:getTheFeed((await Sample.find()).reverse().slice(0, 4)),
      })      //*Return statistics on the API, like how many listings are in the database. ✓
      client.close()
    })
  } catch (error) {
    console.log({message:error})
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