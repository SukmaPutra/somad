import { Response } from "express";
import { AuthRequest } from "../../shared/type";
import { createPostSchema } from "./posts.schema";
import * as postService from './posts.service'

export const createPost = async ( req:AuthRequest, res: Response) => {
    try {
    // Validasi input
    const parsed = createPostSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ 
        message: parsed.error.issues[0].message 
      })
      return
    }

    const post = await postService.createPost({
      ...parsed.data,
      authorId: req.user!.id,
    })

    res.status(201).json({ message: 'Post berhasil dibuat', post })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}