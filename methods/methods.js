const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv/config.js');
const Sample = require('../models/SampleSchema.js')
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
const { sum, getTheFeed, getAverage, findTheDay } = require('../methods/functions.js')


async function createProduct(req, res) {
  const { title, price, description } = req.body
  try {
    const product = new Sample({title, price, description, id: uuidv4() })
    await product.save()
    res.send(`${title} was created`)
  } catch (error) {
    if(error.errors.price.path === "price" ) {
      if(error.errors.price.kind==="Number") res.send(`${errors.price.value} is not a number`)
      if(error.errors.price.kind==="required") res.send(`the price was not mentioned`)
    } else res.send(error)
  }
}

async function returnProcudt(req, res) {
  try {
    const productRequested = await Sample.findById(req.params.id)
    res.send(productRequested)
  } catch (error) {
    res.send(error)
  }
}

async function removeProduct(req, res) {
  try {
    const deletedProduct = await Sample.findById(req.params.id)
    await Sample.deleteOne({ _id: req.params.id })
    res.send(`${deletedProduct.title} was deleted`)
  } catch (error) {
    res.send(error)
  }
}

async function updateProduct(req, res) {
  const { title, price, description } = req.body
  try {
    await Sample.updateOne(
      { _id: req.params.id },
      { $set: { title, price } }
    )
    if (!description) {
      await Sample.updateOne(
        { _id: req.params.id },
        { $set: { description } }
      )
    }
    res.send(`${title} was updated`)
  } catch (error) {
    if(error.errors.price.path === "price" ) {
      if(error.errors.price.kind==="Number") res.send(`${errors.price.value} is not a number`)
      if(error.errors.price.kind==="required") res.send(`the price was not mentioned`)
    } else res.send(error)
  }
}



async function demo(req, res) {
  try {
    if (!!req.query.n) {
      res.send(await Sample.find().limit(parseInt(req.query.n)))
      return;
      //*Return a given number of listings, for example n = 10. This number will be different depending on requests and should be passed in a query string. ✓
    }
    let prices = new Array()
    for await (const e of Sample.find()) prices.push(e.price)
    client.connect(async err => {
      const collection = client.db("Cluster0").collection("samples");
      const { size, storageSize } = await collection.stats()
      const list = (await Sample.find()).reverse()
      res.json({
        totalPosts: await Sample.find().countDocuments(),
        cheapestProduct: Math.min(...prices),
        overPricedProduct: Math.max(...prices),
        averagePrice: Math.floor(sum(...prices) / await Sample.find().countDocuments()),
        todaysposts: getAverage(list, 'day'),
        postingsAverage7daysAgo: getAverage(list, 'week'),
        averagePrice7daysAgo: getAverage(list, 'weeksprice'),
        postingTracker: {
          theceilingOfTheLastWeek: findTheDay(getAverage(list, 'ceiling')),
          // removedPosts: '',
          // lifetimePosts: ''
        },
        DB_size: {
          usedSize: `${size} Bytes`,
          freeStorageSize: `${storageSize - size} Bytes`
        },
        lastPosts: getTheFeed(list.slice(0, 4)),
      })       //*Return statistics on the API, like how many listings are in the database. ✓

      client.close()
    })
  } catch (error) {
    res.send(error)
  }
}


module.exports = {
  createProduct,
  returnProcudt,
  removeProduct,
  updateProduct,
  demo
}