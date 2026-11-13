const express=require('express');
const router=express.Router();
const Category=require('../models/Category');
const {protect,adminOnly}=require('./authMiddleware');
router.post('/',protect,adminOnly ,async (req,res)=>{
    try{
      const category=new Category({title:req.body.title});
      await category.save();
      if(!category){
        return res.status(404).json({error:'category not found'})
      }
      res.json(category);
    }catch(err){
     res.status(500).json({error:err.message});
    }
});
router.get('/',async (req,res)=>{
    try{
      const category=await Category.find();
      if(!category){
        return res.status(404).json({error:'category not found'})
      }
      res.json(category);
    }catch(err){
 res.status(400).json({error:err.message});
    }
})
router.delete('/:id',protect,adminOnly, async(req,res)=>{
  try{
const deleteCategory=await Category.findByIdAndDelete(req.params.id);
if(!deleteCategory){
  return res.status(404).json({error:'Category not found'})
}
res.json(deleteCategory);
  }catch(err){
res.status(400).json({error:err.message})
  }
})
module.exports=router;