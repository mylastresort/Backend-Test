const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv/config.js');
const Sample = require('../models/SampleSchema.js')
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
const { check, sum, getTheFeed, getAverage, findTheDay } = require('../methods/functions.js')


async function createProduct(req, res) {
  const { title, price, date, description } = req.body
  const values = { title, price, date, description }
  console.log(check(values));
  if (!(check(values) instanceof String)) {
    console.log(check(values));
    const product = new Sample({ ...values, id: uuidv4() })
    try {
      await product.save()
      res.send(`${title} was created`)
    } catch (error) {
      if (error.path === "date") {
        res.send('the date format should be like this : year-month-day')
      } else if (error.path === "price") {
        res.send('the price must be a number')
      } else {
        res.send({ message: error })
      }
    }
  } else { res.send(check(values)) }
}

async function returnProcudt(req, res) {
  try {
    const productRequested = await Sample.findById(req.params.id)
    res.send(productRequested)
  } catch (error) {
    res.send({ message: error })
  }
}

async function removeProduct(req, res) {
  try {
    const deletedProduct = await Sample.findById(req.params.id)
    await Sample.deleteOne({ _id: req.params.id })
    res.send(`${deletedProduct.title} was deleted`)
  } catch (error) {
    res.send({ message: error })
  }
}

async function updateProduct(req, res) {
  const { title, price, date, description } = req.body
  const values = { title, price, date, description }
  if (!(check(values) instanceof String)) {
    try {
      await Sample.updateOne(
        { _id: req.params.id },
        {
          $set: {
            title: check(values).title,
            price: check(values).price,
            date: check(values).date
          }
        }
      )
      if (!!check(values).description) {
        await Sample.updateOne(
          { _id: req.params.id },
          { $set: { description: check(values).description } }
        )
      }
      const updated = await Sample.findById(req.params.id)
      res.send(`${updated.title} was updated`)
    } catch (error) {
      if (error.path === "date") {
        res.send('the date format should be like this : year-month-day')
      } else if (error.path === "price") {
        res.send('the price must be a number')
      } else {
        res.send({ message: error })
      }
    }
  } else { res.send(check(values)) }
}



async function demo(req, res) {
  try {
    if (!!req.query.n) {
      const givenNumber = parseInt(req.query.n);
      Requested = await Sample.find().limit(givenNumber)
      res.send(Requested)
      return;
      //*Return a given number of listings, for example n = 10. This number will be different depending on requests and should be passed in a query string. ✓
    }
    let prices = []
    let posts = 0
    for await (const e of Sample.find()) { prices.push(e.price) }
    client.connect(async err => {
      const collection = client.db("Cluster0").collection("samples");
      const { size, storageSize } = await collection.stats()
      res.json({
        totalPosts: await Sample.find().countDocuments(),
        cheapestProduct: Math.min(...prices),
        overPricedProduct: Math.max(...prices),
        averagePrice: Math.floor(sum(...prices) / await Sample.find().countDocuments()),
        todaysposts: getAverage((await Sample.find()).reverse(), 'day'),
        postingsAverage7daysAgo: getAverage((await Sample.find()).reverse(), 'week'),
        postingTracker: {
          theceilingOfTheLastWeek: findTheDay(getAverage((await Sample.find()).reverse(), 'ceiling')),
          // removedPosts: '',
          // lifetimePosts: ''
        },
        DB_size: {
          usedSize: `${size} Bytes`,
          freeStorageSize: `${storageSize - size} Bytes`
        },
        lastPosts: getTheFeed((await Sample.find()).reverse().slice(0, 4)),
      })       //*Return statistics on the API, like how many listings are in the database. ✓
      client.close()
    })
  } catch (error) {
    res.send({ message: error })
  }
}


module.exports = {
  createProduct,
  returnProcudt,
  removeProduct,
  updateProduct,
  demo
}