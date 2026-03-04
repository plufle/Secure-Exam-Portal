const express = require("express");
const router = express.Router();
const { addClassRoom, getClassRoom, deleteClassRoom, editClassRoom } = require("../controllers/ClassRoom");
const verifyToken = require("../middleware/authMiddleware");

// Secure all admin routes
router.use(verifyToken);

router.post("/addClassRoom", addClassRoom);
router.get("/getClassRoom", getClassRoom);
router.delete("/deleteClassRoom", deleteClassRoom);
router.put("/editClassRoom", editClassRoom);
module.exports = router;