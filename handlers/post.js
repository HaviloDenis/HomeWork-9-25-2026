import { postService } from "../services/post.js"

export const postHandler = {
  async getAll(req, res, next) {
    try {
      const { category, take } = req.query
      const posts = await postService.getPosts(category, take)
      res.json(posts)
    } catch (error) {
      next(error)
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const post = await postService.getPostById(id)
      res.json(post)
    } catch (error) {
      next(error)
    }
  },

  async create(req, res, next) {
    try {
      const { title, content, author, category } = req.body
      if (!title || !content) {
        return res.status(422).json({ error: "Title and content are required" })
      }
      const newPost = await postService.createPost({
        title,
        content,
        author,
        category
      })
      res.status(201).json(newPost)
    } catch (error) {
      next(error)
    }
  }
}