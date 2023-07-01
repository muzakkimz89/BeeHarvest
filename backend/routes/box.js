import express from "express";
import { createBox, deleteBox, getABox, getBox } from "../controllers/box.controller.js";

const router = express.Router();

router.post("/", createBox);
router.get("/:id", getBox);
router.get("/abox/:id", getABox);
router.delete("/:id", deleteBox);

export default router;