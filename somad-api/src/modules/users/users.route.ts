import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as userController from './users.controller'

const router = Router()

router.get('/profile', authenticate, userController.getMyProfile)
router.get('/:username', authenticate, userController.getUserByUsername )
router.patch('/profile', authenticate, userController.updateProfile)

export default router
