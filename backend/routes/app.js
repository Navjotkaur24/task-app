const express=require('express');
const app=express();
require('dotenv').config({path:require('path').join(__dirname,'.env')});
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const cookieParser=require('cookie-parser');
app.use(cookieParser());
const cors=require('cors');
app.use(cors({
    origin:process.env.FRONTEND_URL||'http://localhost:5173',
    credentials:true
}));
const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.log('error:',err)
});
app.set('trust proxy',1);
const taskRoutes=require('./taskRoutes');
app.use('/tasks',taskRoutes);
const categoryRoutes=require('./categoryRoutes');
app.use('/categories',categoryRoutes);
const authRoutes=require('./auth');
app.use('/auth',authRoutes);
if(require.main===module){
 const PORT=process.env.PORT || 3000;
 app.listen(PORT,()=>{
    console.log('Server running on port:'+PORT);
});
}
module.exports=app;
