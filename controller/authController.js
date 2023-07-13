const UserModel = require("../models/User");
const NoteModel = require("../models/Note");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const joi = require("joi")
const jwt = require("jsonwebtoken")



const login = async (req,res)=>{
    try {

        const {error} = userValidate(req.body)
        if(error){
            return res.status(404).send(error.details[0].message)
        }
        const {username,password} = req.body

        const user = await UserModel.findOne({username})
        if(!user){
        return res.status(404).json({message: "Invalid Username or Password!"})
        }

        const checkedPassword = await bcrypt.compare(password,user.password)
        if(!checkedPassword){
            return res.status(404).json({message: "Invalid Username or Password!"})
        }
        const token = user.generateTokens()

        let oldTokens = user.tokens || []
        if (oldTokens.length) {
            oldTokens = oldTokens.filter(token =>{
                const timediff = (Date.now() - parseInt(token.signedAt)) / 1000 
                if (timediff < 86400) {
                    return token
                }
            })
        }

        const refresh_Token = user.refreshTokens()
        let oldRefreshTokens = user.refresh_tokens || []
        if (oldRefreshTokens.length) {
            oldRefreshTokens = oldRefreshTokens.filter(refToken =>{
                const timediff = (Date.now() - parseInt(refToken.signedAt)) / 1000 
                if (timediff < 86400) {
                    return refToken
                }
            })
        }

        await UserModel.findByIdAndUpdate(user._id,{tokens: [...oldTokens, {token, signedAt: Date.now().toString()}] , 
        refresh_tokens: [...oldRefreshTokens, {refresh_Token, signedAt: Date.now().toString()}]
    })
        return res.header('x-token',token).status(201).json({Token:token,RefreshToken:refresh_Token})

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
  

}


const logout = async (req,res)=>{
    try {
        if(req.headers && req.headers['x-token']){
            const token =(req.headers['x-token']).split(' ')[0]
            if (!token ) {
                return res.status(401).send('unAuthorization!!')
            }

            const user = await UserModel.findById(req.user._id)
            const tokens = user.tokens
            const restTokens = tokens.filter((tok)=> {tok !== token});
            // console.log(restTokens)
            const refTokens = user.refresh_tokens
            const restRefTokens = refTokens.filter((tok)=> {tok !== token});
            await UserModel.findByIdAndUpdate(req.user._id,{tokens: restTokens,refresh_tokens:restRefTokens})

            res.status(200).json({
                message: "Logout Successfully!"
            })
        }
        
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

const refreshToken = async (req,res) => {
    try {
        const refreshToken = req.header('x-token');
        
        if (!refreshToken) {
           return res.status(401).json({
            errors: [
                {
                message: "Token not found",
                },
            ],
            });
        }

        const user = await jwt.verify(refreshToken,'refresh_key')
        // res.send(user)
        const {_id,username,roles} = user
        const accessToken = jwt.sign({_id,username,roles},process.env.JWT_SECRET , {expiresIn:'30s'})
        res.json({ accessToken });
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}


module.exports = {login,logout,refreshToken}

function userValidate(req) {
    const schema = joi.object({
        username: joi.string().required(),
        password: joi.string().required().min(6).max(255),
    })
    return schema.validate(req)
} 