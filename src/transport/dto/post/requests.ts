export interface CreatePostRequest {
    title: string;
    content: string;
    author?: string;
    categoryId: number;
}
