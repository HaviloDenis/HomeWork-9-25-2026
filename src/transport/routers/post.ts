import { Router } from "express";
import type { PostHandlers } from "../handlers/post.js";

export function createPostRouter(handlers: PostHandlers){
    const router = Router()
    router.get('/', handlers.getPosts)
    router.get('/:id', handlers.getPostById)
    router.post('/', handlers.createPost)


    return router
}

export default createPostRouter
