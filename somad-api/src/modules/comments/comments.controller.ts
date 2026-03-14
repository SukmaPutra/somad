import { Response } from 'express'
import { AuthRequest } from '../../shared/type'
import { createCommentSchema, getCommentsSchema } from './comments.schema'
import * as commentService from './comments.service'
import { getPostById } from '../posts/posts.service'


export const createComment = async (req:AuthRequest, res:Response) => {
    try {
    const postId = req.params.id as string
    // Validasi input
    const parsed = createCommentSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0].message })
      return
    }

    // Cek post ada
    const post = await getPostById(postId)
    if (!post) {
      res.status(404).json({ message: 'Post tidak ditemukan' })
      return
    }

    const comment = await commentService.createComment({
      content: parsed.data.content,
      postId,
      authorId: req.user!.id,
    })

    res.status(201).json({ message: 'Komentar berhasil ditambahkan', comment })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}





export const getComments = async (req:AuthRequest, res:Response) => {
    try {
    const postId = req.params.id as string
    // Validasi query params
    const parsed = getCommentsSchema.safeParse(req.query)
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0].message })
      return
    }

    // Cek post ada
    const post = await getPostById(postId)
    if (!post) {
      res.status(404).json({ message: 'Post tidak ditemukan' })
      return
    }

    const result = await commentService.getComments({
      postId,
      ...parsed.data,
    })

    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}