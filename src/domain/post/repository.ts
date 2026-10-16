import type { Post, PostWithCategory } from "./entity.js";

export type NewPost = Omit<Post, "id">;

export interface PostRepository {
    getAll(categoryName?: string, categoryId?: number, take?: number): Promise<PostWithCategory[]>;
    getById(id: number): Promise<PostWithCategory | null>;
    createPost(data: NewPost): Promise<Post>;
}
