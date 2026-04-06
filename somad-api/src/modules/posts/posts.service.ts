import { prisma } from "../../config/database";

type RawPost = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string | null;
    isVerified: boolean | null;
  };
  likes?: { userId: string }[];
  reposts?: { id: string }[];
  _count: {
    likes: number;
    comments: number;
    reposts: number;
  };
};

/** Dipakai juga oleh users.service (post milik profil) agar bentuk respons sama dengan feed. */
export const formatPost = (post: RawPost) => ({
  id: post.id,
  content: post.content,
  imageUrl: post.imageUrl ?? null,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  isLiked: (post.likes?.length ?? 0) > 0,
  isReposted: (post.reposts?.length ?? 0) > 0,
  _count: {
    likes: post._count.likes,
    comments: post._count.comments,
    reposts: post._count.reposts,
  },
  author: {
    uid: post.author.id, // ← rename id → uid
    username: post.author.username,
    name: post.author.name,
    imageUrl: post.author.avatarUrl ?? null, // ← rename avatarUrl → imageUrl
    isVerified: post.author.isVerified ?? false,
  },
});

// ─── Select yang dipakai berulang ────────────────────────────────────────────
// Dibuat terpisah agar tidak copy-paste di setiap query
const authorSelect = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
  isVerified: true, // ← tambah ini
};

// ─── Create Post ──────────────────────────────────────────────────────────────
export const createPost = async (data: { content: string; imageUrl?: string; authorId: string }) => {
  const post = await prisma.post.create({
    data,
    select: {
      id: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      author: { select: authorSelect },
      _count: { select: { likes: true, comments: true, reposts: true } },
      likes: {
        where: { userId: data.authorId }, // ← user baru buat post, pasti belum like
        select: { userId: true },
      },
      reposts: {
        where: { authorId: data.authorId },
        select: { id: true },
      },
    },
  });

  return formatPost(post);
};

// ─── Get All Posts (Feed) ─────────────────────────────────────────────────────
export const getAllPosts = async (data: { page: number; limit: number; userId: string }) => {
  const { page, limit, userId } = data;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { repostId: null },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        author: { select: authorSelect },
        _count: { select: { likes: true, comments: true, reposts: true } },
        likes: {
          where: { userId }, // ← ambil likes milik user yang login saja
          select: { userId: true }, // ← cukup userId, tidak perlu field lain
        },
        reposts: {
          where: { authorId: userId },
          select: { id: true },
        },
      },
    }),
    prisma.post.count({ where: { repostId: null } }),
  ]);

  return {
    posts: posts.map((post) => formatPost(post)),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
    },
  };
};

// ─── Get Post By ID ───────────────────────────────────────────────────────────
export const getPostById = async (id: string, userId: string) => {
  // ← tambah userId
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      author: { select: authorSelect },
      _count: { select: { likes: true, comments: true, reposts: true } },
      likes: {
        where: { userId }, // ← tambah ini
        select: { userId: true },
      },
      reposts: {
        where: { authorId: userId },
        select: { id: true },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: { select: authorSelect },
        },
      },
    },
  });

  if (!post) return null;

  return formatPost(post);
};

// ─── Delete Post ──────────────────────────────────────────────────────────────
export const deletePost = async (id: string) => {
  await prisma.post.delete({ where: { id } });
};

export const updatePost = async (
  id: string,
  data: { content?: string; imageUrl?: string | null },
  userId: string
) => {
  const post = await prisma.post.update({
    where: { id },
    data,
    select: {
      id: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      author: { select: authorSelect },
      _count: { select: { likes: true, comments: true, reposts: true } },
      likes: {
        where: { userId },
        select: { userId: true },
      },
      reposts: {
        where: { authorId: userId },
        select: { id: true },
      },
    },
  });

  return formatPost(post);
};

// ─── Toggle Like ──────────────────────────────────────────────────────────────
export const toggleLike = async (data: { postId: string; userId: string }) => {
  const { postId, userId } = data;

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
    return { liked: false, message: "Like dibatalkan" }; // ← fix typo: like → liked
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });
    return { liked: true, message: "Post disukai" };
  }
};

export const toggleRepost = async (data: { postId: string; userId: string }) => {
  const { postId, userId } = data;

  const existingRepost = await prisma.post.findFirst({
    where: {
      repostId: postId,
      authorId: userId,
    },
    select: { id: true },
  });

  if (existingRepost) {
    await prisma.post.delete({
      where: { id: existingRepost.id },
    });
    return { reposted: false, message: "Repost dibatalkan" };
  }

  await prisma.post.create({
    data: {
      content: "",
      authorId: userId,
      repostId: postId,
    },
    select: { id: true },
  });

  return { reposted: true, message: "Post berhasil direpost" };
};
