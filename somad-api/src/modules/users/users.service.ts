import { prisma } from "../../config/database";

const userSelect = {
    id:true,
    username:true,
    name:true,
    bio:true,
    avatarUrl:true,
    coverUrl:true,
    createdAt:true,
    _count: {
        select:{
            posts: true,
            followers: true,
            following:true,
        }
    }
}


export const getUserByUsername = async (username:string) => {
    const user = await prisma.user.findUnique({
        where: {username},
        select: userSelect
    })
    return user
}

export const getUserById = async (id:string) => {
    const user = await prisma.user.findUnique({
        where:{id},
        select: {
            ...userSelect,
            email:true
        }
    })
    return user
}