// features/profile/components/ProfileHeader.tsx
import { Avatar, Button } from '@/shared/components';
import { formatCount } from '@/core/utils/formatters';
import { useFollow } from '../hooks/useFollow';
import type { UserProfile } from '@/features/auth/types/auth.types';

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  onEditClick: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onEditClick }: ProfileHeaderProps) => {
  const { isFollowing, toggleFollow } = useFollow(profile.uid);

  return (
    <div className="surface-card rounded-xl p-6 flex flex-col gap-4 mb-4">

      {/* Row atas — avatar + tombol */}
      <div className="flex items-start justify-between">
        <Avatar
          src={profile.photoURL}
          alt={profile.displayName}
          size="xl"
          isVerified={profile.isVerified}
        />

        {isOwnProfile ? (
          <Button variant="secondary" size="sm" onClick={onEditClick}>
            Edit Profil
          </Button>
        ) : (
          <Button
            variant={isFollowing ? 'secondary' : 'primary'}
            size="sm"
            onClick={toggleFollow}
          >
            {isFollowing ? 'Mengikuti' : 'Ikuti'}
          </Button>
        )}
      </div>

      {/* Info user */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-(--color-text-primary)]">
          {profile.displayName}
        </h1>
        <p className="text-(--color-text-muted)] text-sm">
          @{profile.username}
        </p>
        {profile.bio && (
          <p className="text-(--color-text-secondary)] text-sm mt-2 leading-relaxed">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 pt-2 border-t border-(--color-border)]">
        {[
          { count: profile.postsCount,     label: 'Postingan' },
          { count: profile.followersCount, label: 'Pengikut'  },
          { count: profile.followingCount, label: 'Mengikuti' },
        ].map(({ count, label }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-(--color-text-primary)] font-bold">
              {formatCount(count)}
            </span>
            <span className="text-(--color-text-muted)] text-xs">{label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};