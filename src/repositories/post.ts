import type { Post } from "../domain/post/entity.js"
import type { PostRepository } from "../domain/post/repository.js"
import { isStructuredError } from "@prisma/orm-postgres/utils"

// отримуємо тип prisma database client
type DataBase = typeof import("../prisma/db.js").db

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
                    .orderBy((post) => post.id.asc())
                : database.orm.public.Post
                    .include("category")
                    .orderBy((post) => post.id.asc());

            let posts = await query.all();

            // Фільтрація за назвою категорії
            if (categoryName !== undefined && categoryName.trim().length > 0) {
                posts = posts.filter(
                    (p) => p.category.name.toLowerCase() === categoryName.trim().toLowerCase()
                );
            }

            if (!take) {
                return posts;
            }
            // limit - обмежує число постів
            return posts.slice(0, take);
        },
        async getById(id) {
            // where - знайти пост з указаним параметром
            // .first - взяти перший знайдений пост
            return database.orm.public.Post
                .where({ id })
                .include("category")
                .first();
        },
        async createPost(data) {
            const { categoryId, ...fields } = data;
            // create - створення нового поста у базі даних
            try {
                return await database.orm.public.Post.create({
                    ...fields,
                    // connect - використовується для з'єднання записів між собою у таблицях
                    category: (category) => category.connect({ id: categoryId })
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
                    throw new Error("CATEGORY_NOT_FOUND");
                }
                throw error;
            }
        }
    };
}
