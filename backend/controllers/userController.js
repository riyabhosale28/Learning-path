const pool=require("../db");
const roles=require("../config/roles");
async function setUserRole(req,res){
    console.log("ROLE BODY RECEIVED:", req.body); 
    try{
        const {userId,role}=req.body;
        if(!roles[role]){
            return res.status(400).json({error:"Invalid role selected"});
        }
        await pool.query(
            "UPDATE users set target_role=? where id=?",
            [role,userId]
        );

        res.json({success:true,role});
    }catch(err){
        console.error("SET ROLE ERROR:", err);
    res.status(500).json({ error: "Could not set role" });
    }
}

module.exports = { setUserRole };            