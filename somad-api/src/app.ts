import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.route";
import postRouter from "./modules/posts/posts.route";
import commentRouter from "./modules/comments/comments.route";
import userRouter from "./modules/users/users.route";

const app = express();

// Middleware global
app.use(helmet()); // security headers
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", process.env.CLIENT_URL].filter(Boolean) as string[],
    credentials: true,
  }),
);
app.use(morgan("dev")); // logging setiap request
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true }));

// Health check — untuk test apakah server jalan
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes akan ditambah di sini nanti
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/posts/:id/comments", commentRouter);
app.use("/api/users", userRouter);

export default app;
