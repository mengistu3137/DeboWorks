import express from "express"
import { createProfile,getProfiles,getProfileById,getProfileByUser,getProfile, updateProfile } from "../controllers/profile.controller.js"
const router = express.Router()
router.post("/", createProfile)
router.get("/", getProfiles)


router.get("/:slug", getProfile)
router.get("/:profileId", getProfileById)
router.patch("/:slug", updateProfile)
router.get("/user/:userId",getProfileByUser)
export default router