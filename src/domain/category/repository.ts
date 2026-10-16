import type { Category } from "./entity.js";

export type NewCategory = Omit<Category, "id">;

export interface CategoryRepository {
    getAll(): Promise<Category[]>;
    getById(id: number): Promise<Category | null>;
    createCategory(data: NewCategory): Promise<Category>;
}
