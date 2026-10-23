import type { Post } from "../domain/post/entity.js";
import type { PostRepository } from "../domain/post/repository.js";
import { isStructuredError } from "@prisma/orm-postgres/utils";

// отримуємо тип prisma database client
type DataBase = typeof import("../prisma/db.js").db;

export function createPostRepository(database: DataBase): PostRepository {
    return {
        async getAll(categoryName, categoryId, take) {
            // database - підключення до БД 
            // ORM - інструмент для роботи з БД
            // public - схема БД
            // Post - таблиця постів
            // orderBy - сортуємо пости
            // post.id.asc - сортуємо пости за зростанням id (desc - за спаданням)
            const query = categoryId !== undefined
                ? database.orm.public.Post
                    .where({ categoryId })
                    // використовується для загрузки зв'язаних данних (relations)
                    .include("category")
                    .include("author")
                    .orderBy((post) => post.id.asc())
                : database.orm.public.Post
                    .include("category")
                    .include("author")
                    .orderBy((post) => post.id.asc());

            let posts = await query.all();

            // Фільтрація за назвою категорії
            if (categoryName !== undefined && categoryName.trim().length > 0) {
                posts = posts.filter(
                    (p) => p.category.name.toLowerCase() === categoryName.trim().toLowerCase()
                );
            }

            const mappedPosts = posts.map((p) => ({
                id: p.id,
                title: p.title,
                content: p.content,
                categoryId: p.categoryId,
                authorId: p.authorId,
                category: {
                    id: p.category.id,
                    name: p.category.name
                },
                author: {
                    id: p.author.id,
                    email: p.author.email
                }
            }));

            if (!take) {
                return mappedPosts;
            }
            // limit - обмежує число постів
            return mappedPosts.slice(0, take);
        },
        async getById(id) {
            // where - знайти пост з указаним параметром
            // .first - взяти перший знайдений пост
            const post = await database.orm.public.Post
                .where({ id })
                .include("category")
                .include("author")
                .first();

            if (!post) {
                return null;
            }

            return {
                id: post.id,
                title: post.title,
                content: post.content,
                categoryId: post.categoryId,
                authorId: post.authorId,
                category: {
                    id: post.category.id,
                    name: post.category.name
                },
                author: {
                    id: post.author.id,
                    email: post.author.email
                }
            };
        },
        async createPost(data) {
            const { categoryId, authorId, ...fields } = data;
            // create - створення нового поста у базі даних
            try {
                return await database.orm.public.Post.create({
                    ...fields,
                    // connect - використовується для з'єднання записів між собою у таблицях
                    category: (category) => category.connect({ id: categoryId }),
                    author: (author) => author.connect({ id: authorId })
                });
            } catch (error) {
                if (
                    // Перевіряємо що помилка це повноцінний об'єкт javascript
                    error instanceof Error &&
                    // Перевіряємо що у помилки є властивість sqlState
                    "sqlState" in error &&
                    // Код 23505 означає unique violation (порушує унікальність поля)
                    error.sqlState === "23505"
                ) {
                    throw new Error("POST_ALREADY_EXIST");
                }
                if (
                    // Функція перевіряє чи є об'єкт помилки 
                    // структурованим об'єктом нашої orm
                    isStructuredError(error) &&
                    error.code === "ORM.RELATION_ROW_MISSING"
                ) {
                    const message = error.message.toLowerCase();
                    if (message.includes("user") || message.includes("author")) {
                        throw new Error("AUTHOR_NOT_FOUND");
                    }
                    throw new Error("CATEGORY_NOT_FOUND");
                }
                throw error;
            }
        }
    };
}
