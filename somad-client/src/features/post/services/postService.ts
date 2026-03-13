// features/posts/services/postService.ts

import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, orderBy, limit, startAfter, serverTimestamp,
  increment, runTransaction, QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "@/core/api/firebase/firebaseInit";
import { withFirestore } from "@/core/api/interceptors";
import {
  POSTS_COLLECTION,
  LIKES_SUBCOLLECTION,
  REPOSTS_SUBCOLLECTION,
  COMMENTS_SUBCOLLECTION
} from "../constants/postConstants";
import type { Post, Comment } from "../types/post.types";
import type { UserSnippet } from "@/shared/types";
import { uploadImageToCloudinary } from '@/core/utils/cloudinaryService';

const FEED_LIMIT = 10;

// ─── Create Post ──────────────────────────────────────────────────────────────
export const createPostService = async (
  content: string,
  author: UserSnippet,
  imageFile?: File | null
) => {
  return withFirestore(async () => {
    let imageURL: string | null = null;

    if (imageFile) {
      imageURL = await uploadImageToCloudinary(imageFile);
    }

    const postData: Omit<Post, 'id'> = {
      author,
      content,
      imageURL,
      likesCount:    0,
      repostsCount:  0,
      commentsCount: 0,
      createdAt:     serverTimestamp() as any,
      updatedAt:     serverTimestamp() as any,
    };

    const [docRef] = await Promise.all([
      addDoc(collection(db, POSTS_COLLECTION), postData),
      updateDoc(doc(db, 'users', author.uid), {
        postsCount: increment(1)
      }),
    ]);

    return { id: docRef.id, ...postData } as Post;
  });
};

// ─── Get Post By ID ───────────────────────────────────────────────────────────
export const getPostByIdService = async (postId: string ) => {
  return withFirestore(async () => {
    const snap = await getDoc(doc(db, POSTS_COLLECTION, postId))

    if (!snap.exists()) throw new Error("Post tidak ditemukan");

    return {id:snap.id, ...snap.data()} as Post;

  })

}

// ─── Get Feed (Paginated) ─────────────────────────────────────────────────────
export const getFeedService = async (lastDoc?: QueryDocumentSnapshot) => {
  return withFirestore(async () => {
    const q = lastDoc
      ? query(
          collection(db, POSTS_COLLECTION),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(FEED_LIMIT)
        )
      : query(
          collection(db, POSTS_COLLECTION),
          orderBy("createdAt", "desc"),
          limit(FEED_LIMIT)
        );

    const snap = await getDocs(q);
    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Post);
    const newLastDoc = snap.docs[snap.docs.length - 1] ?? null;
    const hasMore = snap.docs.length === FEED_LIMIT;

    return { posts, lastDoc: newLastDoc, hasMore };
  });
};

// ─── Like / Unlike ────────────────────────────────────────────────────────────
export const toggleLikeService = async (postId: string, uid: string) => {
  return withFirestore(async () => {
    const likeRef = doc(db, POSTS_COLLECTION, postId, LIKES_SUBCOLLECTION, uid);
    const postRef = doc(db, POSTS_COLLECTION, postId);

    const liked = await runTransaction(db, async (transaction) => {
      const likeSnap = await transaction.get(likeRef);

      if (likeSnap.exists()) {
        transaction.delete(likeRef);
        transaction.update(postRef, { likesCount: increment(-1) });
        return false;
      } else {
        transaction.set(likeRef, { uid, createdAt: serverTimestamp() });
        transaction.update(postRef, { likesCount: increment(1) });
        return true;
      }
    });

    return { liked };
  });
};

// ─── Repost ───────────────────────────────────────────────────────────────────
export const toggleRepostService = async (postId: string, uid: string) => {
  return withFirestore(async () => {
    const repostRef = doc(db, POSTS_COLLECTION, postId, REPOSTS_SUBCOLLECTION, uid);
    const postRef   = doc(db, POSTS_COLLECTION, postId);

    const reposted = await runTransaction(db, async (transaction) => {
      const repostSnap = await transaction.get(repostRef);

      if (repostSnap.exists()) {
        transaction.delete(repostRef);
        transaction.update(postRef, { repostsCount: increment(-1) });
        return false;
      } else {
        transaction.set(repostRef, { uid, createdAt: serverTimestamp() });
        transaction.update(postRef, { repostsCount: increment(1) });
        return true;
      }
    });

    return { reposted };
  });
};

// ─── Cek Status Like & Repost User ───────────────────────────────────────────
export const checkUserInteractionsService = async (
  postId: string,
  uid: string
) => {
  return withFirestore(async () => {
    const [likeSnap, repostSnap] = await Promise.all([
      getDoc(doc(db, POSTS_COLLECTION, postId, LIKES_SUBCOLLECTION, uid)),
      getDoc(doc(db, POSTS_COLLECTION, postId, REPOSTS_SUBCOLLECTION, uid)),
    ]);

    return {
      isLiked:    likeSnap.exists(),
      isReposted: repostSnap.exists(),
    };
  });
};

// ─── Add Comment ──────────────────────────────────────────────────────────────
export const addCommentService = async (
  postId: string,
  content: string,
  author: UserSnippet
) => {
  return withFirestore(async () => {
    const postRef     = doc(db, POSTS_COLLECTION, postId);
    const commentsRef = collection(db, POSTS_COLLECTION, postId, COMMENTS_SUBCOLLECTION);

    const [commentDoc] = await Promise.all([
      addDoc(commentsRef, {
        postId,
        author,
        content,
        createdAt: serverTimestamp(),
      }),
      updateDoc(postRef, { commentsCount: increment(1) }),
    ]);

    const updatePost = await getDoc(postRef);
    const newCommentCount = updatePost.data()?.commentsCount as number;

    return { id: commentDoc.id, commentsCount: newCommentCount } as Comment & {commentsCount:number};
  });
};

// ─── Get Comments ─────────────────────────────────────────────────────────────
export const getCommentsService = async (postId: string) => {
  return withFirestore(async () => {
    const snap = await getDocs(
      query(
        collection(db, POSTS_COLLECTION, postId, COMMENTS_SUBCOLLECTION),
        orderBy('createdAt', 'asc')
      )
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Comment);
  });
};