import express from "express";
import { createHarvest, deleteHarvest, getHarvest, getLastHarvests } from "../controllers/harvest.controller.js";

const router = express.Router();

router.post("/", createHarvest)
router.get("/:id", getHarvest)
router.delete("/:id", deleteHarvest)
router.post("/lastharvest", getLastHarvests)

export default router