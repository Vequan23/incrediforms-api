require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
import { Request, Response, NextFunction } from "express";
const cookieParser = require("cookie-parser");

import authenticationRoutes from "@/features/authentication/authentication.routes";
import formsRoutes from "@/features/forms/forms.routes";
import aiRoutes from "@/features/ai/ai.routes";
import paymentsRoutes from "@/features/payments/payments.routes";
import { errorHandler } from "@/src/lib/utils/apiError";
import figCollectionsRoutes from "./features/fig-collections/figCollections.routes";
import { scheduledReportsService } from "./features/forms/scheduled-reports/scheduled-reports.service";
import slackAssistantRoutes from "./features/slack-assistants/slack-assistant.routes";
const PROD_FRONTEND_URL = "https://www.incrediforms.com";

if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: PROD_FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );
} else {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
    return;
  });
}

// Add webhook route first
app.use("/webhooks", (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
  return;
}, paymentsRoutes);

// Initialize Slack assistants (integrates with Express)


// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Regular routes
app.use("/auth", authenticationRoutes);
app.use("/forms", formsRoutes);
app.use("/fig-collections", figCollectionsRoutes);
app.use("/slack", slackAssistantRoutes);
// Public AI route
app.use("/ai", (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
  return;
}, aiRoutes);

// Initialize scheduled reports
scheduledReportsService
  .addAllScheduledReportsToCron()
  .catch((error: any) => {
    console.error("Failed to initialize scheduled reports:", error);
  });


// Error handler
app.use(errorHandler);

// Start the server
app.listen(port, async () => {
  console.log(`IncrediForms API listening on port ${port}`);
});