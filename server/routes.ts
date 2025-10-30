import type { Express } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { irregularitySchema } from "@shared/schema";

export function registerRoutes(app: Express) {
  app.get("/api/irregularities", async (_req, res) => {
    try {
      const data = await storage.getIrregularities();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch irregularities" });
    }
  });

  app.post("/api/irregularities", async (req, res) => {
    try {
      const dataSchema = z.array(irregularitySchema);
      const data = dataSchema.parse(req.body);
      await storage.saveIrregularities(data);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid data format" });
    }
  });

  app.get("/api/chart-data", async (_req, res) => {
    try {
      const data = await storage.getChartData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  app.post("/api/chart-data", async (req, res) => {
    try {
      const data = req.body;
      await storage.saveChartData(data);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid data format" });
    }
  });
}
