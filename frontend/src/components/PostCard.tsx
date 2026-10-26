import type { Post } from "../types/post";

type PostCardProps = {
    post: Post;
};

export function PostCard({ post }: PostCardProps) {
    const categoryName = typeof post.category === "object" && post.category !== null ? post.category.name : post.category;
    const authorEmail = typeof post.author === "object" && post.author !== null ? post.author.email : post.author;

    return (
        <div className="Post-Card">
            <span className="Post-Category">
                {categoryName}
            </span>
            <h2>{post.title}</h2>
            <p className="Post-Content">
                {post.content}
            </p>
            <p className="Post-Author">
                Author: {authorEmail}
            </p>
        </div>
    );
}
