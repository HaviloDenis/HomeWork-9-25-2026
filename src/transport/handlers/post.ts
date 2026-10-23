import type { Request, Response } from "express";
import type { PostService } from "../../services/post/post.types.js";
import type { ErrorResponse } from "../dto/post/errors.js";
import type { CreatePostRequest } from "../dto/post/requests.js";
import type { PostResponse } from "../dto/post/responses.js";

export interface PostHandlers {
    getPosts(
        req: Request,
        res: Response<PostResponse[] | ErrorResponse>
    ): Promise<void>;

    getPostById(
        req: Request,
        res: Response<PostResponse | ErrorResponse>
    ): Promise<void>;

    createPost(
        req: Request<{}, {}, CreatePostRequest>,
        res: Response<PostResponse | ErrorResponse>
    ): Promise<void>;
}

export function createPostHandler(postService: PostService): PostHandlers {
    return {
        async getPosts(req, res) {
            try {
                const { take, category, categoryId } = req.query;

                let takeNumber: number | undefined = undefined;
                if (take !== undefined) {
                    takeNumber = Number(take);
                    if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
                        res.status(400).json({ message: "take must be a positive integer" });
                        return;
                    }
                }

                let categoryIdNumber: number | undefined = undefined;
                if (categoryId !== undefined) {
                    categoryIdNumber = Number(categoryId);
                    if (!Number.isInteger(categoryIdNumber) || categoryIdNumber <= 0) {
                        res.status(400).json({ message: "categoryId must be a positive integer" });
                        return;
                    }
                }

                const categoryName = typeof category === "string" ? category : undefined;

                const posts = await postService.getPosts(
                    categoryName,
                    categoryIdNumber,
                    takeNumber
                );
                res.status(200).json(posts);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        },

        async getPostById(req, res) {
            try {
                const postId = Number(req.params.id);

                if (!Number.isInteger(postId) || postId <= 0) {
                    res.status(400).json({ message: "id must be a positive integer" });
                    return;
                }

                const post = await postService.getPostById(postId);

                if (!post) {
                    res.status(404).json({ message: "Post not found" });
                    return;
                }

                res.status(200).json(post);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        },

        async createPost(req, res) {
            try {
                const body = req.body;

                if (body === null || typeof body !== "object" || Array.isArray(body)) {
                    res.status(422).json({ message: "Invalid post data" });
                    return;
                }

                const { title, content, categoryId, authorId } = body;

                if (
                    typeof title !== "string" || title.trim().length === 0 ||
                    typeof content !== "string" || content.trim().length === 0 ||
                    typeof categoryId !== "number" || !Number.isInteger(categoryId) || categoryId <= 0 ||
                    typeof authorId !== "number" || !Number.isInteger(authorId) || authorId <= 0
                ) {
                    res.status(422).json({ message: "Invalid post data" });
                    return;
                }

                const post = await postService.createPost({
                    title,
                    content,
                    categoryId,
                    authorId
                });

                if (!post) {
                    res.status(409).json({ message: "Post already exists" });
                    return;
                }

                res.status(201).json(post);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message === "CATEGORY_NOT_FOUND"
                ) {
                    res.status(404).json({ message: "Category not found" });
                    return;
                }
                if (
                    error instanceof Error &&
                    error.message === "AUTHOR_NOT_FOUND"
                ) {
                    res.status(404).json({ message: "Author not found" });
                    return;
                }
                if (
                    error instanceof Error &&
                    error.message === "POST_ALREADY_EXIST"
                ) {
                    res.status(409).json({ message: "Post already exists" });
                    return;
                }
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        }
    };
}
