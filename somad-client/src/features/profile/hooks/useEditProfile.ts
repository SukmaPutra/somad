// features/profile/hooks/useEditProfile.ts
import { useCallback } from 'react';
import { useForm }     from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore }    from '@/features/auth/store/useAuthStore';
import { useProfileStore } from '../store/profileStore';
import { editProfileService } from '../services/profileService';
import { editProfileSchema, type EditProfileFormData } from '../schemas/profileSchema';
import { UserProfile } from '@/features/auth';

export const useEditProfile = (onSuccess?: () => void) => {
  const { user, setUser } = useAuthStore();
  const { profile, setProfile } = useProfileStore();

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: profile?.displayName ?? '',
      username:    profile?.username    ?? '',
      bio:         profile?.bio         ?? '',
      photoFile:   null,
    },
  });

  const submit = useCallback(async (data: EditProfileFormData) => {
    if (!user) return;

    const { data: updated, success, error } = await editProfileService(user.uid, {
      displayName: data.displayName,
      username:    data.username,
      bio:         data.bio ?? '',
      photoFile:   data.photoFile,
    });

    if (!success || !updated) {
      form.setError('username', { message: error ?? 'Gagal memperbarui profil.' });
      return;
    }

    // Update store auth & profile sekaligus
    const updateProfile: UserProfile = {
      ...user, 
      displayName:updated.displayName ?? user.displayName,
      username: updated.username ?? user.username,
      bio: updated.bio ?? user.bio,
      photoURL: updated.photoURL ?? user.photoURL,
    }
    setUser(updateProfile);
    setProfile(updateProfile);
    onSuccess?.();

  }, [user, profile, form, setUser, setProfile, onSuccess]);

  return {
    form,
    submit: form.handleSubmit(submit),
    isSubmitting: form.formState.isSubmitting,
  };
};