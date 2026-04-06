// features/profile/services/profileService.ts
import { uploadImageToCloudinary } from "@/core/utils/cloudinaryService";
import type { EditProfilePayload } from "../types/profile.types";
import type { UserProfile } from "@/features/auth/types/auth.types";
import type { Post } from "@/features/post/types/post.types";
import apiClient from "@/core/api/client";

const ok = <T>(data: T) => ({ success: true as const, data, error: null as null });
const fail = (error: string) => ({ success: false as const, data: null, error });

export const getProfileByUsernameService = async (username: string) => {
  try {
    const res = await apiClient.get<{
      user: UserProfile;
      isFollowing: boolean;
    }>(`/users/${username}`);

    return {
      data: res.data.user,
      isFollowing: res.data.isFollowing,
      success: true,
      error: null,
    };
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    const status = err?.response?.status;
    const msg =
      status === 404
        ? "Pengguna tidak ditemukan."
        : status === 401
          ? "Sesi habis, silakan login ulang."
          : "Gagal memuat profil.";
    return {
      data: null,
      isFollowing: false,
      success: false,
      error: msg,
    };
  }
};

export const getUserPostsService = async (
  username: string,
  page: number,
  limit: number
) => {
  try {
    const res = await apiClient.get<{
      posts: Post[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
      };
    }>(`/users/${username}/posts`, {
      params: { page, limit },
    });
    return ok(res.data);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return fail(err.message ?? "Gagal memuat postingan.");
  }
};

export const editProfileService = async (payload: EditProfilePayload) => {
  try {
    let avatarUrl: string | undefined;
    if (payload.photoFile) {
      avatarUrl = await uploadImageToCloudinary(payload.photoFile);
    }

    const res = await apiClient.patch<{ message: string; user: UserProfile }>(
      `/users/profile`,
      {
        name: payload.displayName,
        username: payload.username,
        bio: payload.bio ?? "",
        ...(avatarUrl && { avatarUrl }),
      }
    );
    return ok(res.data.user);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "Gagal memperbarui profil.";
    return fail(typeof msg === "string" ? msg : "Gagal memperbarui profil.");
  }
};

export const toggleFollowService = async (username: string) => {
  try {
    const res = await apiClient.post<{ following: boolean; message: string }>(
      `/users/${username}/follow`
    );
    return { data: res.data, success: true, error: null };
  } catch (err: unknown) {
    const e = err as { response?: { status?: number } };
    const status = e?.response?.status;
    const msg =
      status === 401
        ? "Sesi habis, silakan login ulang."
        : status === 400
          ? "Tidak bisa follow pengguna ini."
          : "Gagal memperbarui status follow.";
    return { data: null, success: false, error: msg };
  }
};
