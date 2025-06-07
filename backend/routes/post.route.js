import {
    getPosts,
    getPost,
    createPost,
    deletePost,
    uploadAuth,
    featurePost,
    getPostById,
    updatePost,

   
} from "../controllers/post.controller.js"
import increaseVisit from "../middlewares/increaseVisit.middleware.js"
import express from "express"

const router = express.Router()
router.get('/upload-auth',uploadAuth)
router.get('/',getPosts)

router.post('/',createPost)
router.delete('/:id',deletePost)
router.get('/:slug',increaseVisit,getPost)
// router.get('/:slug',notiyPost,createPost)
router.put('/:slug',updatePost)
router.get('/:id',getPostById)
router.patch('/feature',featurePost)
export default router