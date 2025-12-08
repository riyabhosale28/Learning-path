const express = require("express");
const router = express.Router();
const { startMcqTest, submitMcqTest} = require("../controllers/mcqController");

// Start MCQ test
router.get("/start/:skill", startMcqTest);
router.post("/submit", submitMcqTest);
module.exports = router;
