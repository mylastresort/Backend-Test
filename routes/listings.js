const express = require('express');
const mongoose = require('mongoose');
const { createProduct, returnProduct, removeProduct, updateProduct, demo } = require('../methods/methods.js')

const router = express.Router();

mongoose.connect(process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(console.log('Connected to Mongoo DataBase!!'))
  .catch(err => console.log(err));


router.route('/:id')
  .get(returnProduct)       //*Return a specific product listing. ✓
  .delete(removeProduct)        //*Delete an existing product listing. ✓
  .patch(updateProduct);       //*Update an existing product listing. ✓


router.route('/')
  .get(demo)
  .post(createProduct);        //*Create a new product listing. ✓


module.exports = router;