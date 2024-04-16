import express from "express";
import {
  createReservation,
  deleteReservation,
  getReservation,
  getReservations,
  updateReservation,
} from "../controllers/reservation.js";

const router = express.Router();

router.post("/", createReservation);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);
router.get("/:id", getReservation);
router.get("/", getReservations);

export default router;
