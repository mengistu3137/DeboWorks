import express from "express"

import { getSavedPost, SavePost,setUpProfile ,getUser,getAcceptedResume,acceptResume, getAllUsers, approveUser, rejectUser} from "../controllers/user.controller.js"
const router = express.Router()
router.get("/saved", getSavedPost)
router.get("/accepted/:id", getAcceptedResume)
router.patch("/accept/:id", acceptResume)
router.get("/allUsers", getAllUsers)
router.get("/:clerkUserId", getUser)
router.patch("/save", SavePost)
router.patch("/setup", setUpProfile)
// Add these to your user routes
router.patch('/approve/:userId', approveUser);
router.patch('/reject/:userId', rejectUser);
export default  router