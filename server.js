import express from 'express'
import { postRouter } from './routers/post.js'

const app = express()
const PORT = 8000
const HOST = 'localhost'

app.use(express.json())
app.use('/posts', postRouter)

app.listen(PORT, HOST, () => {
    console.log(`Сервер запущен на http://${HOST}:${PORT}`)
})