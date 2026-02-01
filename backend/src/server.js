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

// Inngest endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// Root endpoint - API info
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "E-Commerce API Server",
    endpoints: {
      health: "/api/health",
      inngest: "/api/inngest"
    },
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Ready for deploy - ONLY serve admin if files exist
if (ENV.NODE_ENV === "production") {
  const adminDistPath = path.join(__dirname, "../admin/dist");
  
  // Only serve static files if admin/dist exists (for monorepo deployment)
  try {
    app.use(express.static(adminDistPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(adminDistPath, "index.html"));
    });
  } catch (error) {
    console.log("Admin dist folder not found - running as API only");
  }
}

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
};

startServer();