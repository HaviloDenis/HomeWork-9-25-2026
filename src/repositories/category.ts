import type { Category } from "../domain/category/entity.js";
import type { CategoryRepository } from "../domain/category/repository.js";

type DataBase = typeof import("../prisma/db.js").db;

export function createCategoryRepository(database: DataBase): CategoryRepository {
    return {
        async getAll() {
            return database.orm.public.Category
                .orderBy((category) => category.id.asc())
                .all();
        },
        async getById(id: number) {
            return database.orm.public.Category
                .where({ id })
                .first();
        },
        async createCategory(data) {
            try {
                return await database.orm.public.Category.create(data);
            } catch (error) {
                if (
                    error instanceof Error &&
                    "sqlState" in error &&
                    error.sqlState === "23505"
                ) {
                    throw new Error("CATEGORY_ALREADY_EXIST");
                }
                throw error;
            }
        }
    };
}
