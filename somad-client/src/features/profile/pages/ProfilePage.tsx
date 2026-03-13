// features/profile/pages/ProfilePage.tsx
import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/shared/components';
import { ProfileHeader }    from '../components/ProfileHeader';
import { ProfilePosts }     from '../components/ProfilePosts';
import { EditProfileModal } from '../components/EditProfileModal';
import { useProfile }       from '../hooks/useProfile';
import { ROUTES }           from '@/config/routes';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { PAGE_TITLES } from '@/shared/constant/seo';

export const ProfilePage = () => {
    useDocumentTitle(PAGE_TITLES.PROFILE);
    
    const { username } = useParams<{ username: string }>();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { profile, posts, isLoading, isLoadingPosts, error , isOwnProfile} = useProfile(username ?? '');

    if (!username) return <Navigate to={ROUTES.FEED} replace />;

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="text-center py-10 text-[#94a3b8]">
                <p className='text-lg'>Profil tidak ditemukan.</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-4'>
            {/* Header profil */}
            <ProfileHeader
                profile={profile}
                isOwnProfile={isOwnProfile}
                onEditClick={()=> setIsEditOpen(true)}
            />

            {/* Postingan user */}
            <ProfilePosts posts={posts} isLoading={isLoadingPosts} />

            {/* Modal edit profil */}
            {isOwnProfile && (
                <EditProfileModal
                    isOpen={isEditOpen}
                    onClose={()=> setIsEditOpen(false)}
                    profile={profile}
                />
            )}
        </div>
    );
};

export default ProfilePage