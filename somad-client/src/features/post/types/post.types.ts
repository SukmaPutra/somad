// features/posts/types/post.types.ts

import { UserSnippet } from "@/shared/types";
import { Timestamp } from "firebase/firestore";

export interface Post {
    id: string;
    author: UserSnippet;
    content: string;
    imageURL: string | null;
    likesCount: number;
    repostsCount: number;
    commentsCount: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;

}

export interface Comment {
    id: string;
    postId: string;
    author: UserSnippet;
    content: string;
    createdAt: Timestamp;
    parentId?: string | null;
}

//untuk cek apakah user sudah like/repost
//disimpan di subcollection posts/{postId}/likes/{uid}

export interface RepostRecord {
    uid: string;
    createdAt: Timestamp;
}

//state Zustand
export interface PostState{
    posts: Post[];
    isLoading:boolean;
    error:string|null;
    hasMore:boolean;
    lastDoc: unknown;
}

export interface PostActions{
    setPosts: (posts: Post[]) => void;
    appendPosts: (posts: Post[]) => void; //infinite scroll
    updatePost: (id:string, data:Partial<Post>) => void;
    removePost: (id:string)=>void;
    setLoading: (isLoading:boolean)=> void;
    setError:(error:string|null)=> void;
    setHasMore: (hasMore:boolean)=>void;
    setLastDoc: (lastDoc:unknown)=>void;
    prependPost: (post: Post) => void;
    reset: ()=>void;

}