// features/profile/services/profileService.ts
import { doc, getDoc, getDocs, updateDoc, collection, query, where, orderBy, serverTimestamp, setDoc, deleteDoc, increment, limit } from "firebase/firestore";
import { db } from "@/core/api/firebase/firebaseInit";
import { withFirestore } from "@/core/api/interceptors";
import { uploadImageToCloudinary } from "@/core/utils/cloudinaryService";
import { FOLLOWS_COLLECTION, POSTS_COLLECTION } from "../constants/profileConstants";
import type { EditProfilePayload } from "../types/profile.types";
import type { UserProfile } from "@/features/auth/types/auth.types";
import type { Post } from "@/features/post/types/post.types";
import { USERS_COLLECTION } from "@/features/auth/constants/authConstants";



// ─── Get Profile by Username ──────────────────────────────────────────────────

export const getProfileByUsernameService = async (username: string) => {
  return withFirestore(async () => {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('username', '==', username.toLowerCase())
    );
    const snap = await getDocs(q);
    if (snap.empty) throw new Error('Pengguna tidak ditemukan.');
    return snap.docs[0].data() as UserProfile;
  });
};

// ─── Get User Posts ───────────────────────────────────────────────────────────

export const getUserPostsService = async (uid:string) => {
    return withFirestore (async () => {
        const snap = await getDocs(
            query(
                collection(db, POSTS_COLLECTION),
                where('author.uid', '==', uid),
                orderBy('createdAt', 'desc'), limit(20)
            )
        );
        return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Post)
    })
}

// ─── Edit Profile ─────────────────────────────────────────────────────────────

export const editProfileService = async (
  uid: string,
  payload: EditProfilePayload
) => {
  return withFirestore(async () => {
    // Cek username baru apakah sudah dipakai user lain
    if (payload.username) {
      const q = query(
        collection(db, USERS_COLLECTION),
        where('username', '==', payload.username.toLowerCase())
      );
      const snap = await getDocs(q);
      const takenByOther = snap.docs.some(d => d.id !== uid);
      if (takenByOther) throw new Error('Username sudah digunakan.');
    }

    let photoURL: string | undefined;

    // Upload foto baru kalau ada
    if (payload.photoFile) {
      photoURL = await uploadImageToCloudinary(payload.photoFile);
    }

    const updateData: Partial<UserProfile> = {
      displayName: payload.displayName,
      username:    payload.username.toLowerCase(),
      bio:         payload.bio ?? '',
      updatedAt:   serverTimestamp() as any,
      ...(photoURL && { photoURL }),
    };

    await updateDoc(doc(db, USERS_COLLECTION, uid), updateData);
    return updateData;
  });
};

// ─── Follow ───────────────────────────────────────────────────────────────────

// ID dokumen follow = "{followerId}_{followingId}"
const followDocId = (followerId: string, followingId: string) => `${followerId}_${followingId}`;

export const followUserService = async (followerId: string, followingId: string) => {
    return withFirestore(async () => {
        const followRef = doc(db, FOLLOWS_COLLECTION, followDocId(followerId, followingId));
        const followerRef = doc(db, USERS_COLLECTION, followerId);
        const followingRef = doc(db, USERS_COLLECTION, followingId);

        await Promise.all([
            setDoc(followRef, {
                followerId,
                followingId,
                createdAt: serverTimestamp()
            }),
            updateDoc(followerRef, { followingCount: increment(1) }),
            updateDoc(followingRef, { followersCount: increment(1) })
        ])
    })
}

export const unfollowUserService = async (followerId: string, followingId: string) => {
    return withFirestore(async () => {
        const followRef = doc(db, FOLLOWS_COLLECTION, followDocId(followerId, followingId));
        const followerRef = doc(db, USERS_COLLECTION, followerId);
        const followingRef = doc(db, USERS_COLLECTION, followingId);

        await Promise.all([
            deleteDoc(followRef),
            updateDoc(followerRef, { followingCount: increment(-1) }),
            updateDoc(followingRef, { followersCount: increment(-1) })
        ])
    })
}

export const checkIsFollowingService = async (followerId: string, followingId: string) => {
    return withFirestore(async () => {
        const snap = await getDoc(
            doc(db, FOLLOWS_COLLECTION, followDocId(followerId, followingId))
        );
        return snap.exists();
    });
};