//verifying jwt
const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if(authHeader) {
        //verify the token
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err,user) => {
            if(err) res.status(403).json("Token is invalid or expired!");
            //if everything okay, assign a user to this request
            req.user = user;
            //handover to the next function for use
            next();
        })
    }else{
        return res.status(401).json("You are not authenticated!");
    }
}

//first check if token belongs to client or admin, 
//and if this user making this request owns this token, 
//before allowing the user to edit
const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAddmin) {
            //pass to next function or use
            next();
        }else{
            res.status(403).json("You do not have permission to do this!!");
        }
    })
}

const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,()=>{
        //verify if user is Admin
        if(req.user.isAdmin) {
            //pass to next function or use
            next();
        }else{
            res.status(403).json("You do not have admin permission to do this!!");
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };