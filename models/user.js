import mongoose from "mongoose";
import Joi from 'joi'
import { join } from "path";
import { v4 as uuidv4 } from 'uuid';

//utiliser schema et model du module mongoose
const {Schema,model} = mongoose;

const userSchema=new Schema(
    {   UserId:{
        type: String,
        default: uuidv4,
        unique: true
      },
        username:{
            type:String,
            required:true //cet attribut est obligatoire
        },

        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String
        },
        otpCode: {
            type: String,
            required: true
        },
        code: {
            type: String,
            default: '',
        },
        codeExpiration: {
            type: Date,
            default: null,
        },

        publickey: {
            type:String,
            required:true //cet attribut est obligatoire
        },
        questsDone: {
            type: Number,
            default: 0
          },
        score: {
            type: Number,
            default: 0,
        }, 
        position: {
            x: Number,
            y: Number,
            z: Number,
        },
        rotation: {
            x: Number,
            y: Number,
            z: Number,
            w: Number,
        }
            
        
        
        
    },

    {
        timestamps:true //ajouter auto createdAt et updatedAt
    }
);

export function userValidate(user){
    const schema = Joi.object({
        UserId: Joi.string().min(4).max(30).required(),
        username: Joi.string().min(4).max(10).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        publickey: Joi.string().min(43).max(43).required()
    });

    return schema.validate(user);
}

export function loginValidate(user){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    });

    return schema.validate(user);
}


export default model("User",userSchema);