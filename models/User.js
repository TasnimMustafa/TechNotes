const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim:true,
        minlength:6,
        validate(value){
            let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");

            if (!password.test(value)) {
                throw new Error("password must include uppercase, lowercase, numbers , special characters")
            }
        }
    },
    roles : {
        type : [String],
        default: ['Employee']
    },
    active:{
        type: Boolean,
        default: true
    },
    tokens : [{
        type: Object
    }],
    refresh_tokens : [{
        type: Object
    }],
    });


    userSchema.methods.generateTokens = function () {
        const token = jwt.sign({_id:this._id,username:this.username,roles:this.roles},process.env.JWT_SECRET , {expiresIn:'30s'})
        return token;
    }

    userSchema.methods.refreshTokens = function () {
        const refreshToken = jwt.sign ({_id:this._id,username:this.username,roles:this.roles},process.env.REFRESH_TOKEN_SECRET , {expiresIn:'1d'})
        return refreshToken
    }

const UserModel = mongoose.model('users',userSchema);

module.exports = UserModel;
