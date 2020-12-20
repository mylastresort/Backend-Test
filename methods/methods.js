import { v4 as uuidv4 } from 'uuid';
import Sample from '../models/SampleSchema.js'

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

export const create =async function(req,res){
  const {title,price,date,description}=req.params
  const values={title,price,date,description}
  if(!(check(values) instanceof String)){
    const product=new Sample({...values, id:uuidv4()})
    try {
      await product.save()
      res.send(`${title} was created`)
    } catch (error) {
      res.json({message:error})
    }
  }else{res.send(check())}
}

export const update=async function(req,res){
  const {id,title,price,date,description}=req.params
  const values={id,title,price,date,description}
  if(!check(values) instanceof String){
    try {
      await Sample.updateOne(
        {id:req.params.id},
        {
          $set:{
            title:check(values).title,
            price:check(values).price,
            date:check(values).date,
            description:null || check(values).description
          }
        }
        )
        res.send(`${title} was updated`)
    } catch (error) {
      res.json({message:err})
    }
  }else{res.send(check())}
}

export const remove=async function(req,res){
  try {
    await Sample.remove({id:req.params.id})
    res.send(`${title} was deleted`)
  } catch (error) {
    res.json({message:error})
  }
}

export const returnedProduct=async function(req,res){
  try {
    const productRequested=await Sample.find((_)=>_id===req.params.id)
    res.send(productRequested)
  } catch (error) {
    res.json({message:error})
  }
}



