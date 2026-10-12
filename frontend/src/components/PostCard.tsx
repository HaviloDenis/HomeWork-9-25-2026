import type { Post } from "../types/post";

type PostCardProps = {
    post: Post
}

export function PostCard({post}: PostCardProps){
    return(
        <div className="Post-Card">
            <span className="Post-Category">
                {post.category}
            </span>
            <h2>{post.title}</h2>
            <p className="Post-Content">
                {post.content}
            </p>
            <p className="Post-Author">
                Author: {post.author}
            </p>
        </div>
    )
}
