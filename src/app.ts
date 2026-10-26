import express from 'express';
import { createPostRouter } from './transport/routers/post.js';
import { createPostHandler } from './transport/handlers/post.js';
import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post.js';
import { createCategoryRouter } from './transport/routers/category.js';
import { createCategoryHandler } from './transport/handlers/category.js';
import { createCategoryRepository } from './repositories/category.js';
import { createCategoryService } from './services/category.js';
import { createUserRepository } from './repositories/user.js';
import { createAuthService } from './services/auth/auth.js';
import { hashPassword, verifyPassword } from './lib/password.js';
import { signAccessToken } from './lib/jwt.js';
import { createAuthHandler } from './transport/handlers/auth.js';
import { createAuthRouter } from './transport/routers/auth.js';
import { db } from './prisma/db.js';
import cors from 'cors';

const app = express();

// Ручний DI для Category
const categoryRepository = createCategoryRepository(db);
const categoryService = createCategoryService(categoryRepository);
const categoryHandlers = createCategoryHandler(categoryService);
const categoryRouter = createCategoryRouter(categoryHandlers);

// Ручний DI для Post
const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandlers = createPostHandler(postService);
const postRouter = createPostRouter(postHandlers);

// Ручний DI для Auth
const authRepository = createUserRepository(db);
const authService = createAuthService(
    authRepository,
    { hash: hashPassword, verify: verifyPassword },
    { signAccessToken }
);
const authHandler = createAuthHandler(authService);
const authRouter = createAuthRouter(authHandler);

app.use(cors({ origin: "http://localhost:5173" }));
// Middleware
app.use(express.json());

// Роути
app.use('/categories', categoryRouter);
app.use('/posts', postRouter);
app.use('/auth', authRouter);

const PORT = 8000;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Сервер запущен на http://${HOST}:${PORT}`);
});
