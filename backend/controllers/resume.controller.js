import Resume from '../models/resume.model.js'
import User from '../models/user.model.js'
import Post from '../models/post.model.js'
import Profile from '../models/profile.model.js'
export const getResumes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = {};
    const { cat, author, search: searchQuery, sort: sortQuery, featured, post } = req.query;

    if (cat) query.category = cat;
    if (searchQuery) query.title = { $regex: searchQuery, $options: 'i' };
    if (author) {
        const user = await User.findOne({ username: author }).select('_id');
        if (!user) return res.status(404).json('No Resume found');
        query.user = user._id;
    }
    if (post) query.post = post;
    if (featured) query.isFeatured = true;

    let sortObj = { createdAt: -1 };
    if (sortQuery === 'oldest') sortObj = { createdAt: 1 };
    else if (sortQuery === 'popular') sortObj = { visit: -1 };
    else if (sortQuery === 'trending') {
        query.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        sortObj = { visit: -1 };
    }

    const resumes = await Resume.find(query)
        .populate('user', 'username img')
        .sort(sortObj)
        .limit(limit)
        .skip((page - 1) * limit);

    const totalResumes = await Resume.countDocuments(query);
    const hasMore = page * limit < totalResumes;

    res.status(200).json({ resumes, hasMore });
};

export const getPost = async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id }).populate(
        'user',
        'username img',
    )
    res.status(200).send(post)
}

// export const  postResume = async (req, res) => {

//     const clerkUserId = req.auth.userId
//     const postId=req.params.postId
//     if (!clerkUserId) {
//        return res.status(401).json("Not authenticated to submit resume")
//     }

//     const user = await User.findOne({ clerkUserId })
//     const newResume = new Resume({
//         ...req.body,
//         user: user._id,
//         post:postId
//     })
//     const savedResume = await newResume.save()
//     setTimeout(() => {
//         res.status(201).json(savedResume)
//     },3000)
// }
export const createResume = async (req, res) => {
    const clerkUserId = req.auth.userId
    const postId = req.params.postId
   
    if (!clerkUserId) {
        return res.status(401).json('Not authenticated to post')
    }
    const user = await User.findOne({ clerkUserId })
    if (!user) {
        return res.status(401).json('user not found')
    }
    const profile = await Profile.findOne({ user: user._id })
    if (!profile) {
        return res.status(401).json('profile not found')
    }
    
    const profileSlug = profile.slug
    const profileId = profile._id
    let slug = user.username.toLowerCase()
    let existingResume = await Resume.findOne({ slug })
    let counter = 2
    while (existingResume) {
        slug = `${slug}-${counter}`
        existingResume = await Resume.findOne({ slug })
        counter++
    }

    const newResume = new Resume({
        user: user._id,
        post: postId,
        profile: profileId,
        profileSlug: slug,
        slug,
        ...req.body,
    })
    const resume = await newResume.save()
    res.status(200).json(resume)
}
