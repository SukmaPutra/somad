import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import * as commentController from './comments.controller'

const router = Router({ mergeParams: true })  // ← mergeParams penting untuk akses :id dari posts

router.post('/', authenticate, commentController.createComment)
router.get('/', authenticate, commentController.getComments)
router.patch('/:commentId', authenticate, commentController.updateComment)
router.delete('/:commentId', authenticate, commentController.deleteComment)

export default router