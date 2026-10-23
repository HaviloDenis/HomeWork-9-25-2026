import type { Category } from "../category/entity.js";
import type { PublicUser } from "../user/entity.js";

export interface Post {
    id: number;
    title: string;
    content: string;
    categoryId: number;
    authorId: number;
}

export type PostWithCategory = Post & {
    category: Category;
    author: PublicUser;
};

export type PostWithRelations = PostWithCategory;
