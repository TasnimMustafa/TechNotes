const jwt = require("jsonwebtoken")

module.exports= function(req,res,next){
   const token = req.header('x-token');
   if (!token) {
    return res.status(401).send('Unauthenticated. Access Rejected!!')
   }

   try {
    const decodeToken = jwt.verify(token,'secret_key')
    req.user = decodeToken;
    next()
   } catch (error) {
    res.status(400).json({message:"Wrong Token"})
   }
}