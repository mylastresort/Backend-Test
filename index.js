import express from 'express';
import bodyParser from 'body-parser';
import listingroutes from './routes/listings.js';
// import cors from 'cors'
// import cors from 'express-cors'
// const cors=require('cors')
// import demo from './routes/demo.js'


const app=express();
const PORT=2222;
app.use((req,res,next)=>{
  res.header('Allow-Control-Allow-Origin','*');
  res.header('Accss-Control-Allow-Headers','*')
  if(req.method==='OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
    return res.status(200).json({})
  }
  next()
})
app.use(bodyParser.json());
app.use('/listings',listingroutes)
// app.use('/listings/demo',demo)


app.listen(PORT,()=>{
  console.log(`Server running on port: http://localhost:${PORT}`
)
});