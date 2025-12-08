const express=require("express");
const router=express.Router();
const {setUserRole}=require("../controllers/userController");

router.post("/role",setUserRole);
module.exports=router;          