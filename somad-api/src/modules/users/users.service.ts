import { prisma } from "../../config/database";
import {UpdateProfileInput} from './users.schema'

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
    },
  });
  return user
};
