import { Response } from "express";
import { AuthRequest } from "../../shared/type";
import { updateProfileSchema, usernameSchema } from "./users.schema";
import * as userService from './users.service';

export const getUserByUsername = async (req:AuthRequest, res:Response) => {
    try {

        const parsed = usernameSchema.safeParse(req.params)
        if(!parsed.success) {
            res.status(400).json({message: parsed.error.issues[0].message})
            return
        }

        const user = await userService.getUserByUsername(parsed.data.username)

        if(!user) {
            res.status(404).json({message: 'User tidak ditemukan'})
            return
        }

        res.status(200).json({user})

    } catch (error:any) {
        res.status(500).json({message: error.message})
    }
}

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