import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as userController from './users.controller'

const router = Router()

router.get('/profile', authenticate, userController.getMyProfile)
router.get('/:username', authenticate, userController.getUserByUsername )
router.patch('/profile', authenticate, userController.updateProfile)

router.post('/:username/follow', authenticate, userController.toggleFollow)       // ← tambah
router.get('/:username/posts', authenticate, userController.getUserPosts)         // ← tambah
router.get('/:username/followers', authenticate, userController.getFollowers)     // ← tambah
router.get('/:username/following', authenticate, userController.getFollowing)     // ← tambah


export default router
