import { Response } from 'express'
import { AuthRequest } from '../../shared/type'
import { commentIdSchema, createCommentSchema, getCommentsSchema, updateCommentSchema } from './comments.schema'
import * as commentService from './comments.service'
import { getPostById } from '../posts/posts.service'
import { ApiError } from '../../shared/errors/api-error'
import { asyncHandler } from '../../shared/utils/async-handler'

export const createComment = asyncHandler<AuthRequest>(async (req, res) => {
  const postId = req.params.postId as string
  const parsed = createCommentSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.issues[0].message, parsed.error.issues)
  }

  const post = await getPostById(postId, req.user!.id)
  if (!post) {
    throw new ApiError(404, "POST_NOT_FOUND", "Post tidak ditemukan")
  }

  const comment = await commentService.createComment({
    content: parsed.data.content,
    postId,
    authorId: req.user!.id,
  })

  res.status(201).json({ message: 'Komentar berhasil ditambahkan', comment })
})

export const getComments = asyncHandler<AuthRequest>(async (req, res) => {
  const postId = req.params.postId as string
  const parsed = getCommentsSchema.safeParse(req.query)
  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.issues[0].message, parsed.error.issues)
  }

  const post = await getPostById(postId, req.user!.id)
  if (!post) {
    throw new ApiError(404, "POST_NOT_FOUND", "Post tidak ditemukan")
  }

  const result = await commentService.getComments({
    postId,
    ...parsed.data,
  })

  res.status(200).json(result)
})

export const updateComment = asyncHandler<AuthRequest>(async (req, res) => {
  const postId = req.params.postId as string
  const parsedCommentId = commentIdSchema.safeParse(req.params)
  if (!parsedCommentId.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsedCommentId.error.issues[0].message, parsedCommentId.error.issues)
  }

  const parsedBody = updateCommentSchema.safeParse(req.body)
  if (!parsedBody.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsedBody.error.issues[0].message, parsedBody.error.issues)
  }

  const post = await getPostById(postId, req.user!.id)
  if (!post) {
    throw new ApiError(404, "POST_NOT_FOUND", "Post tidak ditemukan")
  }

  const comment = await commentService.getCommentById(parsedCommentId.data.commentId)
  if (!comment || comment.postId !== postId) {
    throw new ApiError(404, "COMMENT_NOT_FOUND", "Komentar tidak ditemukan")
  }

  if (comment.authorId !== req.user!.id) {
    throw new ApiError(403, "FORBIDDEN", "Kamu tidak berhak mengedit komentar ini")
  }

  const updatedComment = await commentService.updateComment(parsedCommentId.data.commentId, parsedBody.data.content)
  res.status(200).json({ message: "Komentar berhasil diperbarui", comment: updatedComment })
})

export const deleteComment = asyncHandler<AuthRequest>(async (req, res) => {
  const postId = req.params.postId as string
  const parsedCommentId = commentIdSchema.safeParse(req.params)
  if (!parsedCommentId.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsedCommentId.error.issues[0].message, parsedCommentId.error.issues)
  }

  const post = await getPostById(postId, req.user!.id)
  if (!post) {
    throw new ApiError(404, "POST_NOT_FOUND", "Post tidak ditemukan")
  }

  const comment = await commentService.getCommentById(parsedCommentId.data.commentId)
  if (!comment || comment.postId !== postId) {
    throw new ApiError(404, "COMMENT_NOT_FOUND", "Komentar tidak ditemukan")
  }

  if (comment.authorId !== req.user!.id) {
    throw new ApiError(403, "FORBIDDEN", "Kamu tidak berhak menghapus komentar ini")
  }

  await commentService.deleteComment(parsedCommentId.data.commentId)
  res.status(200).json({ message: "Komentar berhasil dihapus" })
})