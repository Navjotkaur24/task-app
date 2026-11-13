const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const router=express.Router();
const User=require('../models/User');
const rateLimiter=require('express-rate-limit');
const {protect}=require('./authMiddleware');
const limitLogin=rateLimiter({
    windowMs:15*60*1000,
    limit:5,
    message:{error:'Too many attempts try again in 15 minutes '}
})
router.get('/me',protect,(req,res)=>{
    res.json({ok:true});//ask the backend "is my cookie valid?"
})
router.post('/signup',async (req,res)=>{
    try{
      const {name,email,password}=req.body;
      if(!name || !email || !password){
        return res.status(400).json({error:"Name,Email and Password are required"});
        }
        if(password.length<6){
            return res.status(400).json({error:'Password may atleast 6 characters long'})
        }
        const hash=await bcrypt.hash(password,10);
        const user=new User({
            name,email,password:hash
        });
        await user.save();
        res.status(201).json({message:'User created',
            user:{
                id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
            }
        });
    }catch(err){
     res.status(400).json({error:err.message})
    }
});
router.post('/login',limitLogin,async (req,res)=>{
    try{
      const {email,password}=req.body;
      if( !email || !password){
        return res.status(400).json({error:"Email and Password are required"});
        }
        const user=await User.findOne({email});
       
        if(!user){
            return res.status(400).json({error:'Invalid email or password'});
        }
        const isMatched=await bcrypt.compare(password,user.password);
        if(!isMatched){
            return res.status(400).json({error:'Invalid email or password'});
        }
        const token=jwt.sign({id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );
        res.cookie('token',token,{
            httpOnly:true,
            maxAge:24*60*60*1000,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'lax'
        })
        res.status(200).json({message:'Login successful',
            token:token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }})
      
    }catch(err){
res.status(400).json({error:err.message})
    }
})
router.post('/logout',async (req,res)=>{
    res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'lax'
    })
    res.json({message:'Logged out'})
})
module.exports=router;