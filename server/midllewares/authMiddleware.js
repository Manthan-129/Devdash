require('dotenv').config();
const jwt= require('jsonwebtoken');

const authMiddleware= (req, res, next)=>{
    try{
        const authHeader= req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({success: false, message: "Authorization header missing or malformed"});
        }
        const token= authHeader.split(' ')[1];
        if(!token){
            return res.status(401).json({success: false, message: "Token missing"});
        }

        // Verify token
        const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId= decoded.id;
        return next();
    }catch(error){
        console.log("Authentication error:", error.message);
        return res.status(401).json({success: false, message: "Invalid or expired token"});
    }
}

module.exports= {authMiddleware};
