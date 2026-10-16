export interface PostResponse {
    id: number;
    title: string;
    content: string;
    author: string;
    categoryId: number;
    category?: {
        id: number;
        name: string;
    };
}
