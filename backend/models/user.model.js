import mongoose, { Schema } from "mongoose";
import { type } from "os";
const userSchema = new Schema(
    {
      
        
        clerkUserId: {
            type: String,
            required: true,
            unique:true
        },
        
        username: {
        type: String,
        unique: true,
        required:true, 
        },
        email: {
        type: String,
        unique: true,
        required:true, 
        },
        img: {
        type: String
        
        },
        savedPosts: {
            type: [String],
            defualt:[]
    
        },
        acceptedResumes: {
            type: [String],
            defualt:[]
    
        },
        isSetProfile: {
            type: Boolean,
            defualt:false
    
        }
        ,
        isPremium: {
            type: Boolean,
            default: false
        },
        subscriptionPlan: {
            type: String,
            enum: ['monthly', 'yearly', null], 
            default: null
        },
        subscriptionEndDate: {
            type: Date,
            default: null
        },
        
        current_tx_ref: {
            type: String,
            index: true, 
            sparse: true 
        },

        isApproved: {
            type: Boolean,
            default: false
        },
       
    },
    {
timestamps:true
    }
)
export default mongoose.model("User",userSchema)