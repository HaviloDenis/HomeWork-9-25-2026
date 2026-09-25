import { Router } from "express"
import { postHandler } from "../handlers/post.js"
export const postRouter = Router()

postRouter.get("/", postHandler.getAll)
postRouter.get("/:id", postHandler.getById)
postRouter.post("/", postHandler.create)
