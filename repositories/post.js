const posts = [
    {
        title: "second post",
        content: "content 2",
        author: "admin",
        category: "programming"
    }
]

export const postRepository = {
  getAll(category, take) {
    let result = posts
    if (category) {
      result = result.filter(p => p.category === category)
    }
    if (take) {
      result = result.slice(0, Number(take))
    }
    return result
  },

  getById(id) {
    return posts.find(p => p.id === id)
  },
  async addPost(data) {
    const newPost = {
      id: String(posts.length + 1),
      ...data
    }
    posts.push(newPost)
    return newPost
  }
}
