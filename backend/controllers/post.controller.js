import Post from "../models/post.model.js"
import ImageKit from "imagekit"

export const getPosts = async (req, res) => {
   
    const page=parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const query = {}
    const cat=req.query.cat
    const author=req.query.author
    const searchQuery = req.query.search
    const sortQuery=req.query.sort
    const featured = req.query.featured
    if (cat) {
        query.category = cat
    }
    if (searchQuery) {
        query.title={$regex:searchQuery,$options:"i"}
    }
    if (author) {
        const user = await User.findOne({ username: author }).select("_id") 
        if (!user) {
            return res.status(404).json("No post found")
        }
        query.user=user._id
    }

    let sortObj={createdAt:-1}
    if (sortQuery) {
        switch (sortQuery) {
            case "newest":
                sortObj = { createdAt: -1 }
                 break;

    case "oldest":
    sortObj={createdAt:1}

        break;
               
            case "popular":
           sortObj={visit:-1}
                break;
        
            case "trending":
                query.createdAt = {
                    $gte:new Date(new Date().getTime()-7*24*60*60*1000) 
                }
                sortObj = { visit: -1 }


                break;
            
          
        }
    }
    if (featured) {
  query.isFeatured ="true"; // Ensure it's a boolean
}
        const posts = await Post.find(query)
            .populate("user", "username")
            .sort(sortObj)
            .limit(limit)
            .skip((page - 1) * limit);
        const totalPosts = await Post.countDocuments(query)
        const hasMore=page * limit < totalPosts
    res.status(200).json({ posts, hasMore })
    }
  


export const getPost = async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug })
        .populate("user","username img");
    res.status(200).send(post)
}
export const getPostById = async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id })
        .populate("user", "username img");
    if (!post) {
        return "Post not found"
    }
    res.status(200).send(post)
}


export const createPost = async (req, res) => {
        const clerkUserId = req.auth.userId;
        if (!clerkUserId) {
            return res.status(401).json("Not authenticated to post");
        }

        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return res.status(404).json("User not found");
        }

        // Generate unique slug
        let slug = req.body.title.replace(/ /g, "-").toLowerCase();
        let existingPost = await Post.findOne({ slug });
        let counter = 2;
        while (existingPost) {
            slug = `${slug}-${counter}`;
            existingPost = await Post.findOne({ slug });
            counter++;
        }

        // Create and save post
        const newPost = new Post({ user: user._id, slug, ...req.body });
        const post = await newPost.save();

        // Notify all users except the creator
        const recipients = await User.find({ 
            _id: { $ne: user._id },
            notificationPreferences: { $ne: 'none' } // Only users who want notifications
        }).select('email');
    const recipientEmails =`${process.env.RECIPIENT_EMAILS}`
       // recipients.map(recipient => recipient.email).filter(emial => emial)
    if (recipientEmails.length > 0) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user:`mengistu3137`,
                pass:process.env.DEBO_JOB
            }
        })


         const mailOptions = {
            from:`${process.env.SENDER_EMAIL}`,
            bcc:recipientEmails,
            subject: `New Post: ${post.title}`,
                html: `
                    <p>Hello,</p>
                    <p>A new post titled "${post.title}" has been created by ${user.username} of debo job and intership vacancies.</p>
                    <p>Check it out here  <a href="${process.env.CLIENT_URL}/">${post.title}</a></p>
                    <p>Best regards,</p>
                    <p>Debo job and internship vacancies</p>
                `
         };
                transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log(info.response)
    }
})
        
    }
        
        
      
       

      
}

export const deletePost = async (req, res) => {
    const clerkUserId = req.auth.userId
    if (!clerkUserId) {
    return res.status(401).json("Not authenticated to delete")
    }
    
    const role = req.auth.sessionClaims?.metadata?.role || "user" 
    if (role === "admin") {
        await Post.findByIdAndDelete(req.params.id)
      return res.status(200).json("the post has been deleted")
        
  }
  const user=await User.findOne({clerkUserId})
    const deltedPost = await Post.findByIdAndDelete({
        _id: req.params.id,
        user:user._id
       
    })
if (!deltedPost){
        return res.status(403).json("you can delete only your post")
    }
   
    res.status(200).json("the post has been deleted")
}

export const updatePost = async (req, res) => {
    const clerkUserId = req.auth.userId
   
    if (!clerkUserId) {
        return res.status(403).json("Not authenticated to edit post")
    }
        const post=await Post.findOne({slug:req.params.slug}).populate("user","username img")
    if (!post) {
          return res.status(404).json("Post not found")
      }
    const role = req.auth.sessionClaims?.metadata?.role ||"user"
    if (role === "admin") {
        const updatedPost = await Post.findOneAndUpdate(
            {slug:req.params.slug},
            {
                title:req.body.title,
                content:req.body.content,
                category:req.body.category,
                desc:req.body.desc,
                img:req.body.img
            },
            {
                new: true

            },
            {

            }
           
        )
        
    return res.status(200).json(updatedPost)
    }
    return res.status(403).json()
   
    
    
}

export const featurePost = async (req, res) => {
    const clerkUserId = req.auth.userId
    const postId=req.body.postId
    if (!clerkUserId) {
    return res.status(401).json("Not authenticated to feature")
    }
    const role = req.auth.sessionClaims?.metadata?.role || "user" 
    if (role !== "admin") {
      return res.status(403).json("Only admin can feature the posts")
        
  }
    const post = await Post.findById(postId)
    if (!post) {
        return res.status(404).json("Post not found")
    }
    const isFeatured = post.isFeatured
    const updatedPost=await Post.findByIdAndUpdate(postId,{isFeatured:!isFeatured},{new:true})


    
   
    res.status(200).json(updatedPost)
}


const imagekit = new ImageKit({
  urlEndpoint:process.env.IK__URL_ENDPOINT ,
  publicKey:process.env.IK__URL_PUBLIC_KEY  ,
  privateKey:process.env.IK__URL_PRIVATE_KEY 
});
export  const uploadAuth = async (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result)
}