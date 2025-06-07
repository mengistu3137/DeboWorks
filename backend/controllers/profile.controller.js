import Profile from "../models/profile.model.js"
import User from "../models/user.model.js"
import ImageKit  from "imagekit"

// export const createProfile = async (req, res) => {
   
//     const clerkUserId = req.auth.userId
    

//      if (!clerkUserId) {
//         return res.status(401).json("Not authenticated to to profile")
//     }
//     const user = await User.findOne({clerkUserId})
//     /* console.log(user) */
//     if (!user) {
//        return res.status(401).json("user not found")
//     }
    
    
//     const newProfile = new Profile({user:user._id,
//    clerkUserId:clerkUserId,...req.body})
//     const profile=await newProfile.save()
//     res.status(200).json(profile) 
// } 
export const getProfiles = async (req, res) => {
    const profiles = await Profile.find()
        .populate("user", "username email")
        
        res.json(profiles)

}
export const getProfileById = async (req, res) => {
       const profileId = req.params.profileId
 
        const profile = await Profile.findById(profileId)
           
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
    }
    console.log("profile by id",profile)
        res.json(profile)
    } 
    
   

export const getProfileByUser = async (req, res) => {
    const userId  = req.params.userId ;
    if(!userId){
        return res.status(401).json("incorrect userId ")
    }
    const profiles = await Profile.find({user:userId})
        .populate("user", "username email")
    if (profiles.length === 0) {
        return res.status(401).json("profile not found")
    }  
    res.json(profiles)
    
}

export const createProfile = async (req, res) => {
   
   const clerkUserId = req.auth.userId

     if (!clerkUserId) {
        return res.status(401).json("Not authenticated to post")
    }
    const user = await User.findOne({ clerkUserId })
    if (!user) {
       return res.status(401).json("user not found")
    }
    // let slug = req.body.title.replace(/ /g, "-").toLowerCase()
    let slug=user.username.toLowerCase()
    let existingProfile = await Profile.findOne({ slug })
    let counter = 2
    if (existingProfile) {
      return res.status(401).json("User already has a profile")
    }
    
    else {
     const newProfile = new Profile({user:user._id,clerkUserId:clerkUserId,slug,...req.body})
    const profile=await newProfile.save()
    res.status(200).json(profile) 
    }
   
} 
export const getProfile = async (req, res) => {
    const profile = await Profile.findOne({ slug: req.params.slug })
        .populate("user","username img");
    res.status(200).send(profile)
}
export const updateProfile = async (req, res) => {
    const clerkUserId = req.auth.userId
   
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated to edit profile")
    }
        const profile=await Profile.findOne({slug:req.params.slug}).populate("user","username img")
    if (!profile) {
          return res.status(404).json("Profile not found")
      }
    const role = req.auth.sessionClaims?.metadata?.role 
    if (role === "admin") {
        const updatedProfile = await Profile.findByIdAndUpdate(
            profile._id,
            {
                level:req.body.level

            },
            {new:true}
        )
        
    return res.status(200).json("The Comment has been edited")
    }
    if (role === "user") {
        const updateuserProfile = await Profile.findByIdAndUpdate(profile._id, {
            link: req.body.link,
            education: req.body.education,
            opento:req.body.opento
        },
            {
            new:true
        });
    }
   
    return res.json("failed to update the profile")    
    
}