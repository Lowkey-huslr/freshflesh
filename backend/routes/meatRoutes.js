// backend/routes/meatRoutes.js
const express = require("express");
const router = express.Router();
const { addMeat, getAllMeats, deleteMeat } = require("../controllers/MeatController");

router.get("/", getAllMeats);           // GET /api/meats
router.post("/", addMeat);              // POST /api/meats
router.delete("/:id", deleteMeat);      // DELETE /api/meats/:id

module.exports = router;
