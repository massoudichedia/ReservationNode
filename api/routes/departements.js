import express from "express";
import {
  countByCity,
  countByType,
  createDepartement,
  deleteDepartement,
  getDepartement,
  getDepartementRooms,
  getDepartements,
  updateDepartement,
} from "../controllers/departement.js";
import Departement from "../models/Departement.js";
import {verifyAdmin} from "../utils/verifyToken.js"
const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createDepartement);

//UPDATE
router.put("/:id", verifyAdmin, updateDepartement);
//DELETE
router.delete("/:id", verifyAdmin, deleteDepartement);
//GET

router.get("/find/:id", getDepartement);
//GET ALL

router.get("/", getDepartements);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getDepartementRooms);

export default router;
