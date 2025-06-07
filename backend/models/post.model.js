import mongoose, { Schema } from "mongoose";
const postSchema = new Schema(
    {
    
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
          
     

   
    img: {
    type: String
     
    },
    title: {
    type: String,
    required:true, 
        },
    slug: {
            type: String,
            unique: true,
            required:true
            
        },
        desc: {
        type: String,
        
        },
         
        category: {
            type: String,
            default:"General"
        },
        
        content: {
            type: String,
            required:true
    
        },
        isFeatured: {
            type: Boolean,
            default:false
    
        },
        visit: {
            type: Number,
            default: 0,
            
    
        },
        notify: {
            type: Number,
            default: 0,
            
    
        },
        applicationCount: {
            type: Number,
            default: 0
          }
    },
    {
timestamps:true
    }
)


  

export default mongoose.model("Post",postSchema)