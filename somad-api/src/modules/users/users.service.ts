import { prisma } from "../../config/database";
import { UpdateProfileInput } from "./users.schema";
import { formatPost } from "../posts/posts.service";

const userSelect = {
  id: true,
  username: true,
  name: true,
  bio: true,
  avatarUrl: true,
  coverUrl: true,
  createdAt: true,
  _count: {
    select: {
      posts: true,
      followers: true,
      following: true,
    },
  },
};

export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: userSelect,
  });
  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...userSelect,
      email: true,
    },
  });
  return user;
};

export const updateProfile = async (params: {
  userId: string;
  data: UpdateProfileInput;}) => {
  const user = await prisma.user.update({
    where: { id: params.userId },
    data: params.data,
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });
  return user
};

// ── FOLLOW / UNFOLLOW ──────────────────────────────────────────
// Sama seperti toggleLike — cek dulu apakah sudah follow, lalu toggle
export const toggleFollow = async (data: {
  followerId: string
  followingId: string
}) => {
  const { followerId, followingId } = data

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId }  // composite key dari schema
    }
  })

  if (existing) {
    // Sudah follow → unfollow
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } }
    })
    return { following: false, message: 'Unfollow berhasil' }
  } else {
    // Belum follow → follow
    await prisma.follow.create({
      data: { followerId, followingId }
    })
    return { following: true, message: 'Follow berhasil' }
  }
}

const authorSelectProfile = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
  isVerified: true,
} as const;

// ── POST MILIK USER ────────────────────────────────────────────
// Sama bentuknya dengan feed (formatPost): imageUrl author, _count reposts, isLiked / isReposted untuk viewer.
export const getUserPosts = async (data: {
  authorId: string;
  viewerId: string;
  page: number;
  limit: number;
}) => {
  const { authorId, viewerId, page, limit } = data;
  const skip = (page - 1) * limit;

  const where = { authorId };

  const [rows, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        author: { select: authorSelectProfile },
        _count: { select: { likes: true, comments: true, reposts: true } },
        likes: {
          where: { userId: viewerId },
          select: { userId: true },
        },
        reposts: {
          where: { authorId: viewerId },
          select: { id: true },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts: rows.map((p) => formatPost(p)),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
    },
  };
};

// ── FOLLOWERS ──────────────────────────────────────────────────
// Cari semua Follow record dimana followingId = userId
// artinya: siapa saja yang follow user ini
export const getFollowers = async (data: {
  userId: string
  page: number
  limit: number
}) => {
  const { userId, page, limit } = data
  const skip = (page - 1) * limit

  const [followers, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: userId },   // ← orang yang follow saya
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        follower: {   // ← ambil data si follower
          select: { id: true, username: true, name: true, avatarUrl: true }
        },
        createdAt: true,
      }
    }),
    prisma.follow.count({ where: { followingId: userId } })
  ])

  return {
    followers: followers.map(f => ({ ...f.follower, followedAt: f.createdAt })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
    }
  }
}

// ── FOLLOWING ──────────────────────────────────────────────────
// Cari semua Follow record dimana followerId = userId
// artinya: siapa saja yang di-follow oleh user ini
export const getFollowing = async (data: {
  userId: string
  page: number
  limit: number
}) => {
  const { userId, page, limit } = data
  const skip = (page - 1) * limit

  const [following, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId },   // ← orang yang saya follow
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        following: {   // ← ambil data orang yang di-follow
          select: { id: true, username: true, name: true, avatarUrl: true }
        },
        createdAt: true,
      }
    }),
    prisma.follow.count({ where: { followerId: userId } })
  ])

  return {
    following: following.map(f => ({ ...f.following, followedAt: f.createdAt })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
    }
  }
}