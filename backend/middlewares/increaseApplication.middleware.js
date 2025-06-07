import Post from "../models/post.model.js"
const increaseApplication = async (req, res, next) =>
{
    const postId = req.params.postId
    await Post.findOneAndUpdate({ postId }, { $inc: { applicationCount: 1 } }) 
  next()  
}
export default increaseApplication