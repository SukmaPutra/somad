import { Response } from "express";
import { AuthRequest } from "../../shared/type";
import { createPostSchema, getFeedSchema, postIdSchema } from "./posts.schema";
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


export const getAllPosts = async (req:AuthRequest, res: Response) => {
  try {
    const parsed = getFeedSchema.safeParse(req.query)
    if(!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0].message
      })
      return
    }

    const result = await postService.getAllPosts(parsed.data)
    
    res.status(200).json(result)

  } catch (error:any) {
    res.status(500).json({message: error.message})
  }
}

export const getPostById = async (req:AuthRequest, res:Response) => {
  try {
    const parsed = postIdSchema.safeParse(req.params)
    if(!parsed.success) {
      res.status(400).json({message: parsed.error.issues[0].message})
      return
    }

    const post = await postService.getPostById(parsed.data.id)

    if (!post) {
      res.status(400).json({message: 'Post tidak ditemukan'})
      return
    }

    res.status(200).json({post})

  } catch (error:any) {
    res.status(500).json({message: error.message})
  }
}

export const deletePost = async (req:AuthRequest, res:Response) => {
  try {
    const parsed = postIdSchema.safeParse(req.params)
    if (!parsed.success) {
      res.status(400).json({message: parsed.error.issues[0].message})
      return
    }

    const post = await postService.getPostById(parsed.data.id)

    if(!post) {
      res.status(404).json({message: 'Post tidak ditemukan'})
      return
    }

    if(post.author.id !== req.user!.id) {  // ini Authorization = membuktikan kamu boleh melakukan ini.
      res.status(403).json({message: 'Kamu tidak berhak menghapus post ini'})
      return
    }

    await postService.deletePost(parsed.data.id)

    res.status(200).json({message: 'Post berhasil dihapus'})

  } catch (error:any) {
    res.status(500).json({message: error.message})
  }
}