// features/profile/components/EditProfileModal.tsx
import { useEffect, useRef, useState } from "react";
import { Modal, FormField, Button, Avatar } from "@/shared/components";
import { useEditProfile } from "../hooks/useEditProfile";
import type { UserProfile } from "@/features/auth/types/auth.types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaved?: () => void;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  profile,
  onSaved,
}: EditProfileModalProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(profile.avatarUrl);

  const { form, submit, isSubmitting } = useEditProfile(profile, isOpen, {
    afterSave: onSaved,
    onDone: onClose,
  });
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!isOpen) return;
    setPreview(profile.avatarUrl);
  }, [isOpen, profile.avatarUrl]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview && preview !== profile.avatarUrl) URL.revokeObjectURL(preview);
    setValue("photoFile", file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (preview && preview !== profile.avatarUrl) URL.revokeObjectURL(preview);
    };
  }, [preview, profile.avatarUrl]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profil" size="md">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-3">
          <Avatar src={preview ?? undefined} alt={profile.name} size="xl" />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            Ganti Foto
          </Button>
        </div>

        <FormField
          label="Nama Tampilan"
          error={errors.displayName?.message}
          required
          {...register("displayName")}
        />

        <FormField
          label="Username"
          error={errors.username?.message}
          hint="Hanya huruf, angka, dan underscore"
          required
          {...register("username")}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--color-text-secondary)">
            Bio
          </label>
          <textarea
            {...register("bio")}
            rows={3}
            placeholder="Ceritakan tentang dirimu..."
            className="
              w-full rounded-lg px-4 py-2.5 text-sm resize-none
              bg-(--color-input-bg)
              border border-(--color-input-border)
              text-(--color-text-primary)
              placeholder:text-(--color-text-subtle)
              focus:outline-none focus:ring-2 focus:ring-[#137fec]
              hover:border-[#137fec]/50
              transition-colors
            "
          />
          {errors.bio && (
            <span className="text-(--color-error) text-xs">
              {errors.bio.message}
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
};
