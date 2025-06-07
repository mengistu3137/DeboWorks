import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"

export const setUpProfile = async (req, res) => {
    const clerkUserId = req.auth.userId
    const userId=req.body.userId
    if (!clerkUserId) {
    return res.status(401).json("Not authenticated to set up profile")
    }

   /*  const role = req.auth.sessionClaims?.metadata?.role || "user" 
    if (role !== "admin") {
      return res.status(403).json("Only admin can feature the posts")
        
        
  } */
    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json(" the user not found")
    }
    const isSetProfile = user.isSetProfile
    const updatedUser=await User.findByIdAndUpdate(userId,{isSetProfile:!isSetProfile},{new:true})
       
    
   
    res.status(200).json(updatedUser)
}
export const getSavedPost = async (req, res) => {
    const clerkUserId = req.auth.userId

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated to get saved post")
    }
    const user = await User.findOne({clerkUserId })
   
    res.status(200).json(user.savedPosts)
    
    
}
export const acceptResume = async (req, res) => {
    const clerkUserId = req.auth.userId
    const resumeId = req.body.resumeId
    if (!clerkUserId) {
        return res.status(401).json('Not authenticated to to accept Resume')
    }
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(404).json('User not found')
    }
    const isAdmin = req.auth.sessionClaims?.metadata?.role === 'admin' 
    if (isAdmin) {
        const isAccepted = user.acceptedResumes.includes(resumeId)
        console.log(isAccepted)

        
    if (!isAccepted) {
        await User.findByIdAndUpdate(user._id, {
            $push: { acceptedResumes: resumeId },
            
        })

        return res.status(200).json('Application accepted')
        }
        if (isAccepted) {
        await User.findByIdAndUpdate(user._id, {
            $pull: { acceptedResumes: resumeId },
        })
       return res.status(200).json('Application denied') 
    }

   
    }
    else {
        return res.status(403).json("Only admin can accept resumes")
    }
    
}
export const getAcceptedResume = async (req, res) => {
    const clerkUserId = req.auth.userId

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated to get accepted resume")
    }
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(404).json("User not found")
    }
   
    res.status(200).json(user.acceptedResumes)
    
    
}


export const SavePost = async (req, res) => {
    const clerkUserId = req.auth.userId
    const postId=req.body.postId
    if (!clerkUserId) {
      return  res.status(401).json("Not authenticated to to save post")
    }
    const user = await User.findOne({ clerkUserId })
    const isSaved = user.savedPosts.some((p) => p === postId)
    
    if (!isSaved) {
       await User.findByIdAndUpdate(user._id, {
            $push:{savedPosts:postId}
        })
    
    }
    else {
     await User.findByIdAndUpdate(user._id, {
            $pull:{savedPosts:postId}
     })   
        
    }
        
        res.status(200).json(isSaved? "Post unsaved":"Post saved")
    
    }


    export const getUser = async (req, res) => {
    const clerkUserId = req.auth.userId

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated to get user")
    }
    const user = await User.findOne({clerkUserId })
   
        res.status(200).json(user)
        // console.log(user)
    
    
}
export const getAllUsers = async(req, res) => {
    const clerkUserId = req.auth.userId
    if (!clerkUserId) {
        return res.status(401).json("You're not Authenticated to get users")
    }

    const { search, internshipLevel, isPremium ,isApproved} = req.query
    const query = {}

    if (search) {
        query.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ]
    }

    if (isPremium && isPremium !== 'all') {
        query.isPremium = isPremium === 'true';
    }

    
   
    if (isApproved && isApproved !== 'all') {
        query.isApproved = isApproved === 'true'; 
    }

    try {
        let users;
        
        if (internshipLevel && internshipLevel !== 'all') {
            // First find profiles with matching internship level
            const profiles = await Profile.find({ level: internshipLevel }).exec();
            const userIds = profiles.map(profile => profile.user);
            
            // Add user IDs to the query
            query._id = { $in: userIds };
            
            // Find users with matching IDs and other filters
            users = await User.find(query).exec();
        } else {
            // Just use the other filters if no internship level specified
            users = await User.find(query).exec();
        }
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error.message);
    }
}


// Add these to your existing user.controller.js

export const approveUser = async (req, res) => {
    const clerkUserId = req.auth.userId
    console.log("clerkUserId",clerkUserId)
    
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated to approve users");
    }
    const userId = req.params.userId;

    const isAdmin = req.auth.sessionClaims?.metadata?.role === 'admin' || 
                    req.auth.sessionClaims?.metadata?.role === 'super_admin';
    
    if (!isAdmin) {
        return res.status(403).json("Only admins can approve users");
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { isApproved: true },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json("User not found");
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

export const rejectUser = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const userId = req.params.userId;
    console.log("Clerk user id",clerkUserId)
    
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated to reject users");
    }

    const isAdmin = req.auth.sessionClaims?.metadata?.role === 'admin' || 
                    req.auth.sessionClaims?.metadata?.role === 'super_admin';
    
    if (!isAdmin) {
        return res.status(403).json("Only admins can reject users");
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { isApproved: false },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
};