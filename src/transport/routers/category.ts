import { Router } from "express";
import type { CategoryHandlers } from "../handlers/category.js";

export function createCategoryRouter(handlers: CategoryHandlers) {
    const router = Router();
    router.get('/', handlers.getCategories);
    router.get('/:id', handlers.getCategoryById);
    router.post('/', handlers.createCategory);

    return router;
}

export default createCategoryRouter;
