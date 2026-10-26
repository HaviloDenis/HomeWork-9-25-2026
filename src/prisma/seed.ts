import "dotenv/config";
import pg from "pg";
import { db } from "./db.js";
import { hashPassword } from "../lib/password.js";

async function main() {
    console.log("Clearing existing data with pg...");
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query('TRUNCATE TABLE "Post", "Category", "User" RESTART IDENTITY CASCADE;');
    await client.end();

    console.log("Seeding exact homework posts...");
    const passwordHash = await hashPassword("admin12345");
    const user = await db.orm.public.User.create({
        email: "admin",
        passwordHash,
    });

    const category = await db.orm.public.Category.create({
        name: "programming",
    });

    const postsData = [
        { title: "First Post", content: "Content of the first post" },
        { title: "Second Post", content: "Content of the second post" },
        { title: "Third Post", content: "Content of the third post" },
        { title: "Fourth Post", content: "Content of the fourth post" },
        { title: "Fifth Post", content: "Content of the fifth post" },
    ];

    for (const p of postsData) {
        await db.orm.public.Post.create({
            title: p.title,
            content: p.content,
            categoryId: category.id,
            authorId: user.id,
        });
    }

    console.log("Done! 5 posts created successfully.");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Error seeding:", err);
        process.exit(1);
    });
