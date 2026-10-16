import type { PostRepository } from "../domain/post/repository.js";
import type { CreatePostInput, PostService } from "./post/post.types.js";

export function createPostService(repository: PostRepository): PostService {
    return {
        getPosts(categoryName?: string, categoryId?: number, take?: number) {
            return repository.getAll(categoryName, categoryId, take);
        },
        getPostById(id: number) {
            return repository.getById(id);
        },
        async createPost(input: CreatePostInput) {
            const title = input.title.trim();
            const posts = await repository.getAll();
            const duplicate = posts.some(
                (post) => post.title.toLowerCase() === title.toLowerCase()
            );
            if (duplicate) {
                return null;
            }
            return repository.createPost({
                title,
                content: input.content.trim(),
                author: input.author ? input.author.trim() : "admin",
                categoryId: input.categoryId
            });
        }
    };
}
