import mongoose, { Schema } from "mongoose";
const profileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        clerkUserId: {
            type: String,
            required: true,
            unique: true,
        },

        link: {
            type: [{ type: String }],
            default: [],
        },
        education: {
            type: [{ type: String }],
            default: [],
        },
        opento: {
            type: [{ type: String }],
            default: [],
        },
        level: {
            type: [{ type: String }],
            default: ["Unknown"],
        },
        profession: {
            type: [{ type: String }],
            default: [],
        },
        interstedIn: {
            type: [{ type: String }],
            default: [],
        },
        slug: {
            type: String,
            unique: true,
            required: true,
        },
    },
    {
        timestamps: true,
    },
)
export default mongoose.model("Profile",profileSchema)