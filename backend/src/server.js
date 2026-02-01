import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(clerkMiddleware());

// ===== API ROUTES (PHẢI ĐẶT TRƯỚC) =====
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

app.get("/api", (req, res) => {
  // ĐỔI TỪ "/" SANG "/api"
  res.json({
    status: "ok",
    message: "E-Commerce API Server",
    endpoints: {
      health: "/api/health",
      inngest: "/api/inngest",
    },
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ===== SERVE ADMIN (ĐẶT SAU API ROUTES) =====
if (ENV.NODE_ENV === "production") {
  // Logic này sẽ tự động tìm đúng thư mục admin dù bạn đứng ở root hay backend
  const currentDir = process.cwd();
  const adminDistPath = currentDir.endsWith("backend")
    ? path.join(currentDir, "../admin/dist")
    : path.join(currentDir, "admin", "dist");

  console.log("✅ Serving Admin from:", adminDistPath);

  app.use(express.static(adminDistPath));

  // Sửa lỗi PathError tại đây: dùng "(.*)" thay vì "*"
  app.get("(.*)", (req, res) => {
    res.sendFile(path.join(adminDistPath, "index.html"), (err) => {
      if (err) {
        console.error("❌ Error sending index.html:", err);
        res.status(500).send("Không tìm thấy file build của Admin.");
      }
    });
  });
}

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
};

startServer();
