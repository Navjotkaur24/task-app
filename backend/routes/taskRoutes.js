const express=require('express');
const router=express.Router();
const Task=require('../models/Task');
const {protect,adminOnly}=require('./authMiddleware');

router.post('/',protect,async (req,res)=>{
    try{
      const task=new Task({...req.body,user:req.user.id});//the owner comes from the login token,never from the request body
      await task.save();
      
      res.json(task);
    }catch(err){
       res.status(500).json({error:err.message});
    }});
router.get('/',protect,async (req,res)=>{
    try{
     
     const tasks=await Task.find({user:req.user.id}).populate('category');//READ: only this user's tasks
      res.json(tasks);
    }catch(err){
   res.status(400).json({error:err.message})
    }
});
router.put('/:id',protect,async (req,res)=>{
  try{
   const update=await Task.findOneAndUpdate({_id:req.params.id, user:req.user.id},req.body,{new:true,runValidators:true});
  
   if(!update){
    return res.status(401).json({error:'Invalid Id or data'});
   }
   res.json(update);
  }catch(err){
   res.status(400).json({error:err.message});
  }
});
router.delete('/:id',protect,async (req,res)=>{
  try{
    const deleteTask=await Task.findOneAndDelete({_id:req.params.id,user:req.user.id});
    
    if(!deleteTask){
      return res.status(404).json({error:'Task not found'});
    }
    res.json(deleteTask);

  }catch(err){
res.status(400).json({error:err.message})
  }
});
module.exports=router;