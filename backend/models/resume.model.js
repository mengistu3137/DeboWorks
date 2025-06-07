import mongoose, { Schema } from "mongoose";

const jobApplicationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile',
            required: true,
        },
        profileSlug: {
            type: String,
            unique: true,
            required: true,
        },

        fullName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        cv: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
            required: true,
        },
        
    },
    { timestamps: true },
)

export default mongoose.model("JobApplication", jobApplicationSchema);
