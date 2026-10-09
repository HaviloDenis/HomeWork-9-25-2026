import type { Post } from "../domain/post/entity.js"
import type { PostRepository } from "../domain/post/repository.js"

// отримуємо тип prisma database client
type DataBase = typeof import("../prisma/db.js").db

export function createPostRepository(database: DataBase): PostRepository {
    return {
        async getAll(category, take){
            // database - підключення до БД 
            // ORM - інструмент для роботи з БД
            // public - схема БД
            // Post - таблиця постів
            // orderBy - сортуємо пости
            // post.id.asc - сортуємо пости за зростанням id (desc - за спаданням)
            let query = database.orm.public.Post.orderBy((post) => 
                post.id.asc()
            )
            if (category) {
                query = query.where({ category })
            }
            const posts = !take ? await query.all() : await query.limit(take).all()
            return posts.map((post) => ({
                ...post,
                id: String(post.id)
            }))
        },
        async getById(id){
            // where - знайти пост з указаним параметром
            // .first - взяти перший знайдений пост
            const numId = Number(id)
            if (Number.isNaN(numId)) {
                return undefined
            }
            const post = await database.orm.public.Post.where({ id: numId }).first()
            if (!post) {
                return undefined
            }
            return {
                ...post,
                id: String(post.id)
            }
        },
        async createPost(data){
            // create - створення нового поста у базі даних
            const post = await database.orm.public.Post.create(data)
            return {
                ...post,
                id: String(post.id)
            }
        }
    }
}
