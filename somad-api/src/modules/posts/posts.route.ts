import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as postController from './posts.controller';

const router = Router()

router.post('/', authenticate, postController.createPost)
router.get('/', authenticate, postController.getAllPosts)
router.get('/:id', authenticate, postController.getPostById)

export default router