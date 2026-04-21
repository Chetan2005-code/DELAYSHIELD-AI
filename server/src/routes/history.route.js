import { Router } from "express";
import { getAllHistory, getShipmentHistory } from "../controllers/history.controller.js";

const router = Router();

// GET /api/history
router.get("/", getAllHistory);

// GET /api/history/:shipmentId
router.get("/:shipmentId", getShipmentHistory);

export default router;
