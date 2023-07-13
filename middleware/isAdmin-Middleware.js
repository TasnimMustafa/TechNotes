const jwt = require("jsonwebtoken")

module.exports= function(req,res,next){
   try {
    const roles = req.user.roles
    const roleIsAdmin = roles.filter((role)=> role == 'Admin' || role == 'Manager')
    console.log(roleIsAdmin) 
    if(roleIsAdmin.length == 0){
        return res.status(403).send('Not Allowed')
    }
    next()
   } catch (error) {
    res.status(400).json({message:error})
   }
}