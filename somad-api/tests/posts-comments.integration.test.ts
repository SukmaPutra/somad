import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  post: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    findFirst: vi.fn(),
  },
  like: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  comment: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../src/config/database", () => ({
  prisma: prismaMock,
}));

vi.mock("../src/config/jwt", () => ({
  verifyAccessToken: (token: string) => ({
    id: token,
    email: `${token}@mail.com`,
    username: token,
  }),
}));

import app from "../src/app";

const authHeader = (userId: string) => ({ Authorization: `Bearer ${userId}` });

const postRecord = (authorId: string) => ({
  id: "cpost12345678901234567890",
  content: "hello",
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  author: {
    id: authorId,
    username: "user",
    name: "User",
    avatarUrl: null,
    isVerified: false,
  },
  likes: [],
  reposts: [],
  _count: { likes: 0, comments: 0, reposts: 0 },
});

describe("posts and comments integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a post", async () => {
    prismaMock.post.create.mockResolvedValue(postRecord("user-1"));

    const response = await request(app)
      .post("/api/posts")
      .set(authHeader("user-1"))
      .send({ content: "hello" });

    expect(response.status).toBe(201);
    expect(response.body.post.content).toBe("hello");
    expect(prismaMock.post.create).toHaveBeenCalledTimes(1);
  });

  it("gets feed with totalPages", async () => {
    prismaMock.post.findMany.mockResolvedValue([postRecord("user-1")]);
    prismaMock.post.count.mockResolvedValue(1);

    const response = await request(app)
      .get("/api/posts?page=1&limit=10")
      .set(authHeader("user-1"));

    expect(response.status).toBe(200);
    expect(response.body.pagination.totalPages).toBe(1);
    expect(response.body.posts).toHaveLength(1);
  });

  it("toggles like", async () => {
    prismaMock.post.findUnique.mockResolvedValue(postRecord("user-1"));
    prismaMock.like.findUnique.mockResolvedValue(null);
    prismaMock.like.create.mockResolvedValue({ id: "like-1" });

    const response = await request(app)
      .post("/api/posts/cpost12345678901234567890/like")
      .set(authHeader("user-1"));

    expect(response.status).toBe(200);
    expect(response.body.liked).toBe(true);
  });

  it("creates comment", async () => {
    prismaMock.post.findUnique.mockResolvedValue(postRecord("user-1"));
    prismaMock.comment.create.mockResolvedValue({
      id: "ccomment1234567890123456",
      postId: "cpost12345678901234567890",
      content: "komentar",
      createdAt: new Date(),
      author: {
        id: "user-1",
        username: "user",
        name: "User",
        avatarUrl: null,
        isVerified: false,
      },
    });

    const response = await request(app)
      .post("/api/posts/cpost12345678901234567890/comments")
      .set(authHeader("user-1"))
      .send({ content: "komentar" });

    expect(response.status).toBe(201);
    expect(response.body.comment.author.uid).toBe("user-1");
  });

  it("rejects forbidden post delete", async () => {
    prismaMock.post.findUnique.mockResolvedValue(postRecord("another-user"));

    const response = await request(app)
      .delete("/api/posts/cpost12345678901234567890")
      .set(authHeader("user-1"));

    expect(response.status).toBe(403);
    expect(response.body.code).toBe("FORBIDDEN");
  });
});
