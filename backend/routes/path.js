const express = require("express");
const router = express.Router();
const { getLearningPath } = require("../controllers/pathController");

router.get("/:id", getLearningPath);

module.exports = router;
