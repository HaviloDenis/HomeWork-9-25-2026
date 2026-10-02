import type { Post } from "../domain/post/entity.js"
import type { PostRepository } from "../domain/post/repository.js"

export function createPostRepository(): PostRepository {
    let posts: Post[] = [
        {
            id: "1",
            title: "First Post",
            content: "Content of the first post",
            author: "admin",
            category: "programming"
        },
        {
            id: "2",
            title: "Second Post",
            content: "Content of the second post",
            author: "admin",
            category: "programming"
        }
    ]
    return {
        async getAll(category, take){
            let result = [...posts]
            if (category) {
                result = result.filter((post) => post.category === category)
            }
            return take === undefined ? result : result.slice(0, take)
        },
        async getById(id){
            return posts.find(
                (post)=>{ return post.id === id }
            )
        },
        async createPost(data){
            await new Promise<void>((resolve)=>{
                setTimeout(resolve, 500)
            })
            const newId = String(posts.length + 1)
            const post =  {
                id: newId,
                ...data
            }
            posts = [...posts, post]
            return post
        }
    }
}
