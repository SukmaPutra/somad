// features/posts/hooks/usePostDetail.ts
import { useEffect, useState } from "react";
import { usePostStore } from "../store/postStore";
import { getPostByIdService } from "../services/postService";
import type { Post } from "../types/post.types";


export const usePostDetail = (postId: string ) => {
    const {posts} = usePostStore();

    // Cek dulu di store — kalau sudah ada, tidak perlu fetch
    const cachedPost = posts.find((p) => p.id === postId);

    const [post, setPost ] = useState<Post | null>(cachedPost ?? null);
    const [isLoading, setIsLoading] = useState(!cachedPost);
    const [error, setError ] = useState<string | null>(null)

    useEffect(() => {
        if(cachedPost) {
            setPost(cachedPost);
            return;
        }

        const fetchPost = async () =>{
            setIsLoading(true);
            setError(null);

            const {data, success, error: err} = await getPostByIdService(postId)
            if(!success || !data) {
                setError(err ? "Postingan tidak ditemukan" : null);
                setIsLoading(false);
                return;
            }

            setPost(data);
            setIsLoading(false);
        }

        fetchPost();

    }, [postId]);

    return {post, isLoading, error}


}