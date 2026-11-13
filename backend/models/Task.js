const mongoose=require('mongoose');
const taskSchema=new mongoose.Schema({
title:{
   type:String,
   required:true
},
   description:{
      type:String
   },
   completed:
   {
      type:Boolean,
      default:false
   }
   ,
   category:{
    type:mongoose.Schema.Types.ObjectId, ref:'Category'
   },
   user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
   }//this stores the id of the user who created the task.
});
const Task=mongoose.model('Task',taskSchema);
module.exports=Task;