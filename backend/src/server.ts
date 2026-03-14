import express, { Express, Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import sessionRoutes from "./routes/session.routes";
import storageRoutes from "./routes/storage.routes";
import cors from "cors";

config({ quiet: true });
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.APP_URL! || "http://localhost:5173",
      "https://focus-flow-lxfn.vercel.app/",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/storage", storageRoutes);

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ status: "error", message: "Something went wrong!" });
});

const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

server.on("error", (err: any) => {
  console.log(`Error: ${err.message}`);
});
