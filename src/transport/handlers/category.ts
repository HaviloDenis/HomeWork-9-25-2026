import type { Request, Response } from "express";
import type { CategoryService } from "../../services/category/category.types.js";
import type { ErrorResponse } from "../dto/category/errors.js";
import type { CreateCategoryRequest } from "../dto/category/requests.js";
import type { CategoryResponse } from "../dto/category/responses.js";

export interface CategoryHandlers {
    getCategories(
        req: Request,
        res: Response<CategoryResponse[] | ErrorResponse>
    ): Promise<void>;

    getCategoryById(
        req: Request,
        res: Response<CategoryResponse | ErrorResponse>
    ): Promise<void>;

    createCategory(
        req: Request<{}, {}, CreateCategoryRequest>,
        res: Response<CategoryResponse | ErrorResponse>
    ): Promise<void>;
}

export function createCategoryHandler(
    categoryService: CategoryService
): CategoryHandlers {
    return {
        async getCategories(req, res) {
            try {
                const categories = await categoryService.getCategories();
                res.status(200).json(categories);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        },

        async getCategoryById(req, res) {
            try {
                const categoryId = Number(req.params.id);

                if (!Number.isInteger(categoryId) || categoryId <= 0) {
                    res.status(400).json({ message: "id must be a positive integer" });
                    return;
                }

                const category = await categoryService.getCategoryById(categoryId);

                if (!category) {
                    res.status(404).json({ message: "Category not found" });
                    return;
                }

                res.status(200).json(category);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        },

        async createCategory(req, res) {
            try {
                const body = req.body;

                if (body === null || typeof body !== "object" || Array.isArray(body)) {
                    res.status(422).json({ message: "Invalid category data" });
                    return;
                }

                const { name } = body;

                if (typeof name !== "string" || name.trim().length === 0) {
                    res.status(422).json({ message: "Invalid category data" });
                    return;
                }

                const category = await categoryService.createCategory({ name });

                if (!category) {
                    res.status(409).json({ message: "Category already exists" });
                    return;
                }

                res.status(201).json(category);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message === "CATEGORY_ALREADY_EXIST"
                ) {
                    res.status(409).json({ message: "Category already exists" });
                    return;
                }
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        }
    };
}
