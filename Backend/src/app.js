import cors from "cors";
import express from "express";
import multer from "multer";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import propertyRoutes from "./routes/property.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://zameenhub.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("ZameenHub API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((error, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", error);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }

  if (error) {
    const nestedMessage =
      error.message ||
      error.error?.message ||
      error.error?.error?.message ||
      error.cause?.message ||
      "Server error";

    return res.status(500).json({ message: nestedMessage });
  }

  next();
});

export default app;
