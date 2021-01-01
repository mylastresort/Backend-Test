const express = require('express');
const bodyParser = require('body-parser');
const listingroutes = require('./routes/listings.js');


const app = express();
const PORT = 2222;
app.use((req, res, next) => {
  res.header('Allow-Control-Allow-Origin', '*');
  res.header('Accss-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')
    return res.status(200).json({})
  }
  next()
})
app.use(bodyParser.json());
app.use('/listings', listingroutes)


app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`
  )
});