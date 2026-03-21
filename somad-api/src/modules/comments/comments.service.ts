import { prisma } from '../../config/database'

const authorSelect = { id: true, username: true, name: true, avatarUrl: true, isVerified: true }

const formatComment = (comment: {
  id: string
  postId: string
  content: string
  createdAt: Date
  author: {
    id: string
    username: string
    name: string
    avatarUrl: string | null
    isVerified: boolean | null
  }
}) => ({
  id: comment.id,
  postId: comment.postId,
  content: comment.content,
  createdAt: comment.createdAt,
  author: {
    uid: comment.author.id,
    username: comment.author.username,
    name: comment.author.name,
    imageUrl: comment.author.avatarUrl ?? null,
    isVerified: comment.author.isVerified ?? false,
  },
})

export const createComment = async (data: {
  content: string
  postId: string
  authorId: string
}) => {
  const comment = await prisma.comment.create({
    data,
    select: {
      id: true,
      postId: true,
      content: true,
      createdAt: true,
      author: {
        select: authorSelect
      }
    }
  })

  return formatComment(comment)
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
        postId: true,
        content: true,
        createdAt: true,
        author: {
          select: authorSelect
        }
      }
    }),
    prisma.comment.count({ where: { postId } })
  ])

  return {
    comments: comments.map((comment) => formatComment(comment)),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
    }
  }
}

export const getCommentById = async (commentId: string) => {
  return prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, postId: true, authorId: true },
  })
}

export const updateComment = async (commentId: string, content: string) => {
  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
    select: {
      id: true,
      postId: true,
      content: true,
      createdAt: true,
      author: {
        select: authorSelect,
      },
    },
  })

  return formatComment(comment)
}

export const deleteComment = async (commentId: string) => {
  await prisma.comment.delete({
    where: { id: commentId },
  })
}