import type { CategoryRepository } from "../domain/category/repository.js";
import type { CategoryService, CreateCategoryInput } from "./category/category.types.js";

export function createCategoryService(repository: CategoryRepository): CategoryService {
    return {
        getCategories() {
            return repository.getAll();
        },
        getCategoryById(id: number) {
            return repository.getById(id);
        },
        async createCategory(input: CreateCategoryInput) {
            const name = input.name.trim();
            const categories = await repository.getAll();
            const duplicate = categories.some(
                (category) => category.name.toLowerCase() === name.toLowerCase()
            );
            if (duplicate) {
                return null;
            }
            return repository.createCategory({ name });
        }
    };
}
