const express = require("express");
const router = express.Router();
const { butcherSignup, butcherLogin } = require("../controllers/butcherController");

router.post("/signup", butcherSignup);
router.post("/login", butcherLogin);
router.delete("/:id", async (req, res) => {
  try {
    const butcher = await Butcher.findByIdAndDelete(req.params.id);
    if (!butcher) {
      return res.status(404).json({ msg: "Butcher not found" });
    }
    res.json({ msg: "Butcher removed successfully" });
  } catch (err) {
    console.error("Error deleting butcher:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
