import { Router } from "express";
import express from "express";
import { dialogflowWebhook } from "../controllers/dialogflow.controller";

const router = express.Router();
router.post("/webhook/dialogflow", dialogflowWebhook);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;
