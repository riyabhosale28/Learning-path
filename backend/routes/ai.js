const express=require("express");
const router=express.Router();
const {explainTopic}=require("../controllers/aiController");

router.post("/explain",explainTopic);
module.exports=router;