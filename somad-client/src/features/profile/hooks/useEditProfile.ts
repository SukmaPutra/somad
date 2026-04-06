// features/profile/hooks/useEditProfile.ts
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useProfileStore } from "../store/profileStore";
import { editProfileService } from "../services/profileService";
import { editProfileSchema, type EditProfileFormData } from "../schemas/profileSchema";
import type { UserProfile } from "@/features/auth/types/auth.types";

type EditProfileCallbacks = {
  /** Dipanggil jika profil diperbarui tanpa ganti URL (untuk refetch halaman yang sama). */
  afterSave?: () => void;
  /** Selalu dipanggil di akhir (tutup modal). */
  onDone: () => void;
};

export const useEditProfile = (
  profile: UserProfile,
  isOpen: boolean,
  callbacks: EditProfileCallbacks
) => {
  const { user, setUser } = useAuthStore();
  const { setProfile } = useProfileStore();
  const navigate = useNavigate();

  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: profile.name,
      username: profile.username,
      bio: profile.bio ?? "",
      photoFile: null,
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset({
      displayName: profile.name,
      username: profile.username,
      bio: profile.bio ?? "",
      photoFile: null,
    });
  }, [isOpen, profile.id, profile.name, profile.username, profile.bio, form]);

  const submit = useCallback(
    async (data: EditProfileFormData) => {
      if (!user) return;

      const { data: updated, success, error } = await editProfileService({
        displayName: data.displayName,
        username: data.username,
        bio: data.bio ?? "",
        photoFile: data.photoFile,
      });

      if (!success || !updated) {
        form.setError("username", {
          message: error ?? "Gagal memperbarui profil.",
        });
        return;
      }

      const merged: UserProfile = {
        ...user,
        ...updated,
        _count: updated._count ?? user._count,
      };

      setUser(merged);
      setProfile(merged);

      if (updated.username === profile.username) {
        callbacksRef.current.afterSave?.();
      }

      if (updated.username !== profile.username) {
        navigate(`/${updated.username}`, { replace: true });
      }

      callbacksRef.current.onDone();
    },
    [user, profile.username, form, setUser, setProfile, navigate]
  );

  return {
    form,
    submit: form.handleSubmit(submit),
    isSubmitting: form.formState.isSubmitting,
  };
};
