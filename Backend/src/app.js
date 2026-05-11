import cors from "cors";
import express from "express";
import multer from "multer";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import propertyRoutes from "./routes/property.routes.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:5173,https://zameenhub.vercel.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin is not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
});

app.get("/", (req, res) => {
  res.send("ZameenHub API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", error);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ message: messages[0] || "Validation failed", errors: messages });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with this value already exists" });
  }

  const statusCode = error.statusCode || error.status || 500;
  const nestedMessage =
    error.message ||
    error.error?.message ||
    error.error?.error?.message ||
    error.cause?.message ||
    "Server error";

  return res.status(statusCode).json({ message: nestedMessage });
});

export default app;
