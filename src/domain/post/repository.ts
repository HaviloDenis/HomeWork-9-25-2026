import type { Post } from "./entity.js";

export type NewPost = Omit<Post, "id">
export interface PostRepository{
    getAll(category?:string, take?:number): Promise<Post[]>
    getById(id:string): Promise<Post | undefined>
    createPost(data: NewPost): Promise<Post>
}
