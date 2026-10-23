export interface PostResponse {
    id: number;
    title: string;
    content: string;
    categoryId: number;
    authorId: number;
    category?: {
        id: number;
        name: string;
    };
    author?: {
        id: number;
        email: string;
    };
}
