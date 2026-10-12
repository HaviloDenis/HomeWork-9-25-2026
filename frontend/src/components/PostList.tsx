import type { Post } from "../types/post";
import { PostCard } from "./PostCard";

type PostListProps = {
    posts: Post[] 
}

export function PostList({posts}: PostListProps){
    return(
        <div className="posts">
            {posts.map((post)=>(
                <PostCard key={post.id} post={post}/>
            ))}
        </div>
    )
}
