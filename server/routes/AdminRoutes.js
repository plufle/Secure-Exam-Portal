const express = require("express");
const router = express.Router();
const { addClassRoom, getClassRoom, deleteClassRoom, editClassRoom, addTest, getTests, editTest, deleteTest, getAdminReports } = require("../controllers/ClassRoom");
const verifyToken = require("../middleware/authMiddleware");

// Secure all admin routes
router.use(verifyToken);

router.post("/addClassRoom", addClassRoom);
router.get("/getClassRoom", getClassRoom);
router.delete("/deleteClassRoom", deleteClassRoom);
router.put("/editClassRoom", editClassRoom);

router.post("/addTest", addTest);
router.get("/getTests", getTests);
router.put("/editTest", editTest);
router.delete("/deleteTest", deleteTest);

router.get("/getAdminReports", getAdminReports);

module.exports = router;