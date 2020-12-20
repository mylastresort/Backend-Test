import mongoose from 'mongoose';


// this didnt work for me
// const SampleSchema=mongoose.Schema({
//   title:{
//     type: String,
//     required: true
//   },price:{
//     type:String,
//     required:true
//   },date:{
//     type:Date,
//     default:Date.now()
//   },description:{
//     type:String,
//     required:false
//   }
// })

// export default SampleSchema;
module.exports=mongoose.model('Sample',{
  title:{
    type: String,
    required: true
  },
  price:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  },
  description:{
    type:String,
    required:false
  }
})