import { prisma } from '../../config/database'

export const createPost = async (data: {
  content: string
  imageUrl?: string
  authorId: string
}) => {
  const post = await prisma.post.create({
    data,
    select: {
      id: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        }
      }
    }
  })

  return post
}
