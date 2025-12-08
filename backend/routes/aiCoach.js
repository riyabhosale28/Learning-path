const express = require("express");
const router = express.Router();
const { coachChat } = require("../controllers/aiCoachController");

router.post("/coach", coachChat);

module.exports = router;
