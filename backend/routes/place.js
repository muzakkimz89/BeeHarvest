import express from "express";
import { createPlace, deletePlace, getPlace } from "../controllers/place.controller.js";

const router = express.Router();

router.post("/", createPlace)
router.get("/:id", getPlace)
router.delete("/:id", deletePlace)

export default router