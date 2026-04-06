import { Response } from "express";
import { AuthRequest } from "../../shared/type";
import { updateProfileSchema, usernameSchema, paginationSchema } from "./users.schema";
import * as userService from './users.service';
import { prisma } from "../../config/database";

export const getUserByUsername = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = usernameSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0].message });
      return;
    }

    const user = await userService.getUserByUsername(parsed.data.username);
    if (!user) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }

    // cek status follow
    const followRecord = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId:  req.user!.id,
          followingId: user.id,
        },
      },
    });

    res.status(200).json({ user, isFollowing: !!followRecord });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProfile = async (req:AuthRequest, res:Response) => {
    try {
        const user = await userService.getUserById(req.user!.id)

        if(!user) {
            res.status(404).json({message: 'User tidak ditemukan'})
            return
        }

        res.status(200).json({user})

    } catch (error:any) {
        res.status(500).json({message:error.message})
    }

}

export const updateProfile = async (req:AuthRequest, res:Response) => {
    try {
        const parsed = updateProfileSchema.safeParse(req.body)
        if(!parsed.success){
            res.status(400).json({message: parsed.error.issues[0].message})
            return
        }

        const user = await userService.updateProfile({
            userId: req.user!.id,
            data: parsed.data,
        })

        res.status(200).json({message: 'Profile berhasil diupdate', user}

        )
    } catch (error:any) {
        res.status(500).json({message:error.message})
    }
}

// ── FOLLOW / UNFOLLOW ──────────────────────────────────────────
// Cek user target ada, lalu toggle follow
export const toggleFollow = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = usernameSchema.safeParse({ username: req.params.username })
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0].message })
      return
    }

    // Cari user target berdasarkan username
    const targetUser = await userService.getUserByUsername(parsed.data.username)
    if (!targetUser) {
      res.status(404).json({ message: 'User tidak ditemukan' })
      return
    }

    // Tidak bisa follow diri sendiri
    if (targetUser.id === req.user!.id) {
      res.status(400).json({ message: 'Tidak bisa follow diri sendiri' })
      return
    }

    const result = await userService.toggleFollow({
      followerId: req.user!.id,
      followingId: targetUser.id,
    })

    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// ── POST MILIK USER ────────────────────────────────────────────
// Ambil semua post milik user tertentu berdasarkan username
export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userParsed = usernameSchema.safeParse({ username: req.params.username })
    if (!userParsed.success) {
      res.status(400).json({ message: userParsed.error.issues[0].message })
      return
    }

    const pageParsed = paginationSchema.safeParse(req.query)
    if (!pageParsed.success) {
      res.status(400).json({ message: pageParsed.error.issues[0].message })
      return
    }

    const targetUser = await userService.getUserByUsername(userParsed.data.username)
    if (!targetUser) {
      res.status(404).json({ message: 'User tidak ditemukan' })
      return
    }

    const result = await userService.getUserPosts({
      authorId: targetUser.id,
      viewerId: req.user!.id,
      ...pageParsed.data,
    })

    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// ── FOLLOWERS ──────────────────────────────────────────────────
// Daftar orang yang follow user ini
export const getFollowers = async (req: AuthRequest, res: Response) => {
  try {
    const userParsed = usernameSchema.safeParse({ username: req.params.username })
    if (!userParsed.success) {
      res.status(400).json({ message: userParsed.error.issues[0].message })
      return
    }

    const pageParsed = paginationSchema.safeParse(req.query)
    if (!pageParsed.success) {
      res.status(400).json({ message: pageParsed.error.issues[0].message })
      return
    }

    const targetUser = await userService.getUserByUsername(userParsed.data.username)
    if (!targetUser) {
      res.status(404).json({ message: 'User tidak ditemukan' })
      return
    }

    const result = await userService.getFollowers({
      userId: targetUser.id,
      ...pageParsed.data,
    })

    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// ── FOLLOWING ──────────────────────────────────────────────────
// Daftar orang yang di-follow oleh user ini
export const getFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const userParsed = usernameSchema.safeParse({ username: req.params.username })
    if (!userParsed.success) {
      res.status(400).json({ message: userParsed.error.issues[0].message })
      return
    }

    const pageParsed = paginationSchema.safeParse(req.query)
    if (!pageParsed.success) {
      res.status(400).json({ message: pageParsed.error.issues[0].message })
      return
    }

    const targetUser = await userService.getUserByUsername(userParsed.data.username)
    if (!targetUser) {
      res.status(404).json({ message: 'User tidak ditemukan' })
      return
    }

    const result = await userService.getFollowing({
      userId: targetUser.id,
      ...pageParsed.data,
    })

    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}



