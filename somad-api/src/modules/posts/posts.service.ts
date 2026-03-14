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


export const getAllPosts = async (data: {page:number; limit:number}) => {
  const {page, limit } = data
  const skip = (page-1) * limit

  const [posts, total] = await Promise.all([  //`Promise.all` di sini menjalankan dua query **secara bersamaan** — ambil posts dan hitung total sekaligus. Lebih cepat daripada satu per satu.
    prisma.post.findMany({
      skip,
      take:limit,
      orderBy: {createdAt: 'desc' },
      select: {
        id:true,
        content:true,
        imageUrl:true,
        createdAt:true,
        author: {
          select: {id:true, username:true, name:true, avatarUrl:true}
        },
        _count: {select:{likes: true, comments:true}}
      }
    }),
    prisma.post.count()
  ])

  return {
    posts,
    pagination: {
      total, 
      page,
      limit,
      totaPages: Math.ceil(total/limit),
      hasNext: page <Math.ceil(total /limit),
    }
  }
}

export const  getPostById = async (id:string) => {
  const post = await prisma.post.findUnique({
    where:{id},
    select:{
       id: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: { id: true, username: true, name: true, avatarUrl: true }
      },
      comments:{
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: { id: true, username: true, name: true, avatarUrl: true }
          }
        }
      },
      _count:{select: {likes:true, comments:true}}
    }
  })

  return post
}

export const deletePost  = async (id:string) => {
  await prisma.post.delete({
    where:{id}
  })
}