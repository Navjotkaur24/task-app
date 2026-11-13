const jwt=require('jsonwebtoken');
async function protect(req,res,next){
    let token;
    if(req.cookies?.token){
        token=req.cookies.token;
    }else if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return res.status(401).json({error:'token not provided'})
    }
try{
    const decoded=await jwt.verify(token,process.env.JWT_SECRET);
if(!decoded){
    return res.status(401).json({error:'Invalid or expired token '})
}
req.user=decoded;
next();
}catch(err){
    res.status(400).json({error:err.message});
}
}
function adminOnly(req,res,next){
    if(req.user.role !=='admin'){
        return res.status(403).json({error:'Admin only!'})
    }
    next();
}
module.exports={protect,adminOnly};