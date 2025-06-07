import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import Comment from "../models/post.model.js"
import { Webhook } from "svix"

export const clerkWebhook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
    if (!WEBHOOK_SECRET) {
        throw new Error("Webhook secret needed")
    }
    const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
    try {
        evt = wh.verify(payload, headers);
    } catch (err) {
        res.status(400).json({
            message: "Webhook verification failed"
        });
        console.error("Webhook verification failed", err);
        console.log("Webhook Payload:", payload);
        return;
    }

   
    if (evt.type === "user.created") {
        const email = evt.data.email_addresses[0].email_address
        const createdUsername=email.split('@')[0].match(/^[a-zA-Z]+/)[0]
        const image = evt.data.profile_img_url
   
        const newUser = new User({
            clerkUserId: evt.data.id,
            username: evt.data.username || createdUsername,
            email: email,
            img: image ||  "profile_icon.jpg"
,
        });

    await newUser.save();
        console.log("the user is succefully created") 
       

    }

    
    if (evt.type === "user.deleted") {
        const deletedUser = await User.findOneAndDelete({
            clerkUserId: evt.data.id
        })

        await Post.deleteMany({ user: deletedUser._id })
        await Comment.deleteMany({ user: deletedUser._id })
     
        return res.status(200).json({
            message: "the webhook is recieved"
        })
    }
}