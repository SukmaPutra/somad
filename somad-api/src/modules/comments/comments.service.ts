import { prisma } from '../../config/database'

export const createComment = async (data: {
  content: string
  postId: string
  authorId: string
}) => {
  const comment = await prisma.comment.create({
    data,
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: { id: true, username: true, name: true, avatarUrl: true }
      }
    }
  })

  return comment
}

export const getComments = async (data: {
  postId: string
  page: number
  limit: number
}) => {
  const { postId, page, limit } = data
  const skip = (page - 1) * limit

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { postId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: { id: true, username: true, name: true, avatarUrl: true }
        }
      }
    }),
    prisma.comment.count({ where: { postId } })
  ])

  return {
    comments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
    }
  }
}