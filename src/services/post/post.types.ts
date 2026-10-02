import type { Post } from "../../domain/post/entity.js"

export interface CreatePostInput {
    title: string,
    content: string,
    author?: string,
    category: string
}

export interface PostService {
    getPosts(category?: string, take?: number): Promise<Post[]>
    getPostById(id: string): Promise<Post | undefined>
    createPost(input: CreatePostInput): Promise<Post | null>
}
