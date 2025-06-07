import express from "express"
import {
    getResumes,
    createResume,
    getPost,
  
} from '../controllers/resume.controller.js'
import increaseApplication from "../middlewares/increaseApplication.middleware.js"
const router = express.Router()
router.post("/:postId",increaseApplication, createResume)
router.get('/:id',getPost)
router.get('/', getResumes)
export default router
