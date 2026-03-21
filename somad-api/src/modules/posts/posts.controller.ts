import { Response } from "express";
import { AuthRequest } from "../../shared/type";
import { createPostSchema, getFeedSchema, postIdSchema, updatePostSchema } from "./posts.schema";
import * as postService from './posts.service'
import { ApiError } from "../../shared/errors/api-error";
import { asyncHandler } from "../../shared/utils/async-handler";

export const createPost = asyncHandler<AuthRequest>(async (req, res) => {
  const parsed = createPostSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.issues[0].message, parsed.error.issues)
  }

  const post = await postService.createPost({
    ...parsed.data,
    authorId: req.user!.id,
  })

  res.status(201).json({ message: 'Post berhasil dibuat', post })
});

export const getAllPosts = asyncHandler<AuthRequest>(async (req, res) => {
  const parsed = getFeedSchema.safeParse(req.query)
  if(!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.issues[0].message, parsed.error.issues)
  }

  const result = await postService.getAllPosts({
    ...parsed.data,
    userId: req.user!.id
  })
  
  res.status(200).json(result)
});

export const getPostById = asyncHandler<AuthRequest>(async (req, res) => {
  const parsed = postIdSchema.safeParse(req.params)
  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.issues[0].message, parsed.error.issues)
  }

  const post = await postService.getPostById(parsed.data.id, req.user!.id)

  if (!post) {
    throw new ApiError(404, "POST_NOT_FOUND", "Post tidak ditemukan")
  }

  res.status(200).json({ post })
});

export const updatePost = asyncHandler<AuthRequest>(async (req, res) => {
  const parsedParams = postIdSchema.safeParse(req.params)
  if (!parsedParams.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsedParams.error.issues[0].message, parsedParams.error.issues)
  }

  const parsedBody = updatePostSchema.safeParse(req.body)
  if (!parsedBody.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsedBody.error.issues[0].message, parsedBody.error.issues)
  }

  const existingPost = await postService.getPostById(parsedParams.data.id, req.user!.id)
  if (!existingPost) {
    throw new ApiError(404, "POST_NOT_FOUND", "Post tidak ditemukan")
  }

  if (existingPost.author.uid !== req.user!.id) {
    throw new ApiError(403, "FORBIDDEN", "Kamu tidak berhak mengedit post ini")
  }

  const updatedPost = await postService.updatePost(parsedParams.data.id, parsedBody.data, req.user!.id)
  res.status(200).json({ message: "Post berhasil diperbarui", post: updatedPost })
});

export const deletePost = asyncHandler<AuthRequest>(async (req, res) => {
  const parsed = postIdSchema.safeParse(req.params)
  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.issues[0].message, parsed.error.issues)
  }

  const post = await postService.getPostById(parsed.data.id, req.user!.id)
  if (!post) {
    throw new ApiError(404, "POST_NOT_FOUND", "Post tidak ditemukan")
  }

  if (post.author.uid !== req.user!.id) {
    throw new ApiError(403, "FORBIDDEN", "Kamu tidak berhak menghapus post ini")
  }

  await postService.deletePost(parsed.data.id)
  res.status(200).json({ message: 'Post berhasil dihapus' })
});

export const toggleLike = asyncHandler<AuthRequest>(async (req, res) => {
  const parsed = postIdSchema.safeParse(req.params)
  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.issues[0].message, parsed.error.issues)
  }

  const post = await postService.getPostById(parsed.data.id, req.user!.id)
  if (!post) {
    throw new ApiError(404, "POST_NOT_FOUND", "Post tidak ditemukan")
  }

  const result = await postService.toggleLike({
    postId: parsed.data.id,
    userId: req.user!.id
  })

  res.status(200).json(result)
});

export const toggleRepost = asyncHandler<AuthRequest>(async (req, res) => {
  const parsed = postIdSchema.safeParse(req.params)
  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.issues[0].message, parsed.error.issues)
  }

  const post = await postService.getPostById(parsed.data.id, req.user!.id)
  if (!post) {
    throw new ApiError(404, "POST_NOT_FOUND", "Post tidak ditemukan")
  }

  const result = await postService.toggleRepost({
    postId: parsed.data.id,
    userId: req.user!.id
  })

  res.status(200).json(result)
});
