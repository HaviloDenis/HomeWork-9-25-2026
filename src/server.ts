import express from 'express'
import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post.js'
import { createPostHandler } from './transport/handlers/post.js'
import { createPostRouter } from './transport/routers/post.js'
//const express = require('express');

const app = express();
// app.use(express.json()) - встроенный middleware, который позволяет спарсить json обьект в js обьект
app.use(express.json())

// Compоsition root -- это место где приложения создаёт конкретные реализации, и связывает их между собой
const postRepository = createPostRepository()
const postService = createPostService(postRepository)
const postHandler = createPostHandler(postService)
const postRouter = createPostRouter(postHandler)

app.use('/posts', postRouter)
// posts    ->  router.get('/', getPosts)
// posts/1  ->  router.get('/:id', getPostById)

const PORT = 8000
const HOST = 'localhost'; 



app.listen(PORT, HOST, ()=>{
    console.log(`Сервер запущен на http://${HOST}:${PORT}`)
})
