const express = require("express");
const router = express.Router();
const { addClassRoom, getClassRoom, deleteClassRoom, editClassRoom } = require("../controllers/ClassRoom");

router.post("/addClassRoom", addClassRoom);
router.get("/getClassRoom", getClassRoom);
router.delete("/deleteClassRoom", deleteClassRoom);
router.put("/editClassRoom", editClassRoom);
module.exports = router;