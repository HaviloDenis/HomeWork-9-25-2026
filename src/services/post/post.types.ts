import type { Post, PostWithCategory } from "../../domain/post/entity.js";

export interface CreatePostInput {
    title: string;
    content: string;
    author?: string;
    categoryId: number;
}

export interface PostService {
    getPosts(categoryName?: string, categoryId?: number, take?: number): Promise<PostWithCategory[]>;
    getPostById(id: number): Promise<PostWithCategory | null>;
    createPost(input: CreatePostInput): Promise<Post | null>;
}
