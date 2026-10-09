import express from 'express'
import { createPostRouter } from './transport/routers/post.js'
import { createPostHandler } from './transport/handlers/post.js';
import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post.js';
import { db } from './prisma/db.js';
//const express = require('express');

const app = express();
const postRepository = createPostRepository(db)
const postService = createPostService(postRepository)
const postHandlers = createPostHandler(postService)
const postRouter = createPostRouter(postHandlers)
// app.use(express.json()) - встроенный middleware, который позволяет спарсить json обьект в js обьект
app.use(express.json())
app.use('/posts', postRouter)
// posts    ->  router.get('/', getPosts)
// posts/1  ->  router.get('/:id', getPostById)

const PORT = 8000
const HOST = 'localhost'; 



app.listen(PORT, HOST, ()=>{
    console.log(`Сервер запущен на http://${HOST}:${PORT}`)
})
