export type Post = {
    id: number;
    title: string;
    content: string;
    author: string | { id: number; email: string };
    category: string | { id: number; name: string };
    authorId?: number;
    categoryId?: number;
};
