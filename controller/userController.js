const NoteModel = require("../models/Note");
const UserModel = require("../models/User");
const bcrypt = require("bcrypt")

const register = async (req,res)=>{
    try {
        const {username,password,roles} = req.body

        if(!username || !password){
            res.status(400).send("All field are required")
        }

        const user = await UserModel.findOne({username})
        if(user){
        return res.json({message: "user already exist!"})
        }

        const hashedPass = bcrypt.hashSync(password,8);

        const newUser =new UserModel({
            username,
            password:hashedPass,
            roles
        })

        await newUser.save();
        return res.status(201).json({message:"user created!",data:newUser})

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
  

}

const showUsers = async (req,res)=>{
    try {
        const users = await UserModel.find({}).select('-password')
        if (users.length == 0) {
            return res.status(404).send("No found users")
        }
        res.status(200).json({"data":users})
    } catch (error) {
        res.status(400).json({message : error.message})
    }
}

const profile = async (req,res)=>{
    try {
        const userData = await UserModel.findById(req.user._id).select('-password')
        res.status(200).json({
            data: userData
        })
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

const updateUserData = async (req,res)=>{
    try {
        const {username,roles,active} = req.body

        if(!username || !roles.length || !Array.isArray(roles) || typeof active !== 'boolean'){
            return res.status(400).json({"message":"All fields are required"})
        }

        const duplicate = await UserModel.findOne({username})
        if(duplicate){
        return res.json({message: "username already exist!"})
        }

        const _id = req.params.id
        const user = await UserModel.findByIdAndUpdate({_id},{username,roles,active},{
            new:true,
            runValidators:true
        });
        
        if(!user){
            return res.status(404).json({message:`can not find any user with ID : ${_id}`})
        }


        res.status(200).json({
            status : 200,
            message:"user updated!",
            data: user
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
  

}


const changePassword = async (req,res)=>{
    try {
        const {password} = req.body
        const hashedPass = bcrypt.hashSync(password,8);
        const _id = req.params.id
        const user = await UserModel.findByIdAndUpdate({_id},{password:hashedPass},{
            new:true,
            runValidators:true
        });
        
        if(!user){
            return res.status(404).json({message:`can not find any user with ID : ${_id}`})
        }

        res.status(200).json({
            status : 200,
            message:"password changed successfully!",
            data: user
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
  

}

const deleteUser = async (req,res)=>{
    try {
        const _id = req.params.id

        const note = await NoteModel.findOne({user:_id})
        if (note) {
            return res.status(400).json({message:"User has assigned notes"})
        }
        
        const user = await UserModel.findByIdAndDelete({_id})
        if (!user) {
           return res.status(404).json({message:`can not find any user with ID : ${_id}`})
        }
        res.status(200).json({"message":"user deleted successfully!!","data":user})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}




module.exports = {register,profile,updateUserData,changePassword,showUsers,deleteUser}

