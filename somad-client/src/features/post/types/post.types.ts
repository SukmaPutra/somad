// features/posts/types/post.types.ts

import { UserSnippet } from "@/shared/types";


export interface Post {
    id: string
  author: UserSnippet
  content: string
  imageUrl: string | null
  _count: {
    likes: number
    comments: number
    reposts: number
  }
  isLiked: boolean     // ← tambah
  isReposted: boolean  // ← tambah
  createdAt: string
  updatedAt: string

}

export interface Comment {
    id: string;
    postId: string;
    author: UserSnippet;
    content: string;
    createdAt: string;
    parentId?: string | null;
}

//untuk cek apakah user sudah like/repost
//disimpan di subcollection posts/{postId}/likes/{uid}

export interface RepostRecord {
    uid: string;
    createdAt: string;
}

//state Zustand
export interface PostState{
    posts: Post[];
    isLoading:boolean;
    error:string|null;
    hasMore:boolean;
    currentPage: number
}

export interface PostActions{
    setPosts: (posts: Post[]) => void;
    appendPosts: (posts: Post[]) => void; //infinite scroll
    updatePost: (id:string, data:Partial<Post>) => void;
    removePost: (id:string)=>void;
    setLoading: (isLoading:boolean)=> void;
    setError:(error:string|null)=> void;
    setHasMore: (hasMore:boolean)=>void;
    setCurrentPage: (page: number)=>void;
    prependPost: (post: Post) => void;
    reset: ()=>void;

}