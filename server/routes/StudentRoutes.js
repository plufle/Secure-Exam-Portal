const express = require("express");
const router = express.Router();
const { getExams, submitExam, getResults } = require("../controllers/student");
const verifyToken = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/exams", getExams);
router.post("/submitExam", submitExam);
router.get("/results", getResults);

module.exports = router;
