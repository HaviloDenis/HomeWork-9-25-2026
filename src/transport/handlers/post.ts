import type { PostService } from "../../services/post/post.types.js"
import type { Request, Response } from "express"
import type { CreatePostRequest } from "../dto/post/requests.js"
import type { PostResponse } from "../dto/post/responses.js"
import type { ErrorResponse } from "../dto/post/errors.js"

export interface PostHandlers{ 
    getPosts(
        req:Request, 
        res:Response<PostResponse[] | ErrorResponse>
    ): Promise<void>

    getPostById(
        req:Request, 
        res:Response<PostResponse | ErrorResponse>
    ): Promise<void>

    createPost(
        req:Request<{}, {}, CreatePostRequest>, 
        res:Response<PostResponse | ErrorResponse>
    ): Promise<void>
}

export function createPostHandler(
    postService : PostService
): PostHandlers{
    return {
        async getPosts(req,res){
            try{ 
                const {take, category} = req.query

                if (!take && !category) {
                    const posts = await postService.getPosts()
                    res.status(200).json(posts)
                    return
                }
                
                let takeNumber: number | undefined = undefined
                if (take) {
                    takeNumber = Number(take)
                    if (! Number.isInteger(takeNumber) || takeNumber <= 0){
                        res.status(400).json({message: 'Take must be a positive integer'})
                        return
                    }
                }
                
                const posts = await postService.getPosts(typeof category === 'string' ? category : undefined, takeNumber)
                res.status(200).json(posts)
            } 
            catch(error){
                console.error(error)
                res.status(500).json({message: "server error"})   
            }
            
        },

        async getPostById(req,res){
            const { id } = req.params
            if (!id || typeof id !== 'string') {
                res.status(400).json({message: 'Id must be provided'})
                return
            }

            const post = await postService.getPostById(id)

            if (! post) {
                res.status(404).json({message: 'Post not found'})
                return
            }
            
            res.status(200).json(post)
        },

        async createPost(req,res){
            const { title, content, category, author } = req.body;
            if  (
                typeof title !== 'string' || !title.trim() || 
                typeof content !== 'string' || !content.trim() ||
                typeof category !== 'string' || !category.trim()

            ){
                res.status(422).json({message: "invalid post"})
                return
            }
            try{
                const createdPost = await postService.createPost({title, content, category, author})
                
                if(!createdPost){
                    res.status(409).json({message: "Post already exists"})
                    return
                }
                res.status(201).json(createdPost)
            }catch(error){
                console.error(error)
                res.status(500).json({message:'Failed to create'})
            }
        }
    } 
}
