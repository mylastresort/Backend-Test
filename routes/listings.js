import express from 'express';
import {create,update,remove,returnedProduct} from '../methods/methods.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv/config.js';


const router=express.Router();


mongoose.connect(process.env.DB_CONNECTION, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
.then(console.log('Connected to Mongoo DataBase!!'))
.catch(err =>console.log(err));

//*Create a new product listing. ✓
router.post('/:title/:price/:date/:description', create)

//*Update an existing product listing. ✓
router.patch('/:id/:title/:price/:date/:description',update)

router.route('/:id')
.delete(remove)   //*Delete an existing product listing. ✓
.get(returnedProduct)    //*Return a specific product listing. ✓


export default router