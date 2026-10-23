import type { Post, PostWithCategory } from "../../domain/post/entity.js";

export interface CreatePostInput {
    title: string;
    content: string;
    categoryId: number;
    authorId: number;
}

export interface PostService {
    getPosts(categoryName?: string, categoryId?: number, take?: number): Promise<PostWithCategory[]>;
    getPostById(id: number): Promise<PostWithCategory | null>;
    createPost(input: CreatePostInput): Promise<Post | null>;
}
