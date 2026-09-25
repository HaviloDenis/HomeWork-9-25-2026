import { postRepository } from "../repositories/post.js"

export const postService = {
  async getPosts(category, take) {
    return postRepository.getAll(category, take)
  },

  async getPostById(id) {
    const post = postRepository.getById(id)
    if (!post) {
      const error = new Error("Post not found")
      error.status = 404
      throw error
    }
    return post
  },

  async createPost(data) {
    return await postRepository.addPost(data)
  }
}
