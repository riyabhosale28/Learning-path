const pool=require('../db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const saltRounds=10;
const JWT_SECRET=process.env.JWT_SECRET;
async function register(req,res){
    try{
        console.log("REGISTER BODY:", req.body);
        const {name,email,password,desired_role}=req.body;
        const hash=await bcrypt.hash(password,saltRounds);
        const [result]=await pool.query(
            'INSERT into users(name,email,password_hash,desired_role)values(?,?,?,?)',
            [name,email,hash,desired_role]
        );
          console.log("INSERT RESULT:", result);
        res.json({success:true,userId:result.insertId});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Registeration failed'});
    }
}
async function  login(req,res) {
    try{
        console.log("REQ BODY:", req.body);
        const {email,password}=req.body;
         console.log("EMAIL:", email);
    console.log("PASSWORD:", password);
        const[rows]=await pool.query('SELECT id,name,email,password_hash,target_role from users where email=?',[email]);
        const user=rows[0];
        if(!user)return res.status(401).json({error:'Invalid credentials'});
         console.log("DB HASH:", user.password_hash); 
        const match=await bcrypt.compare(password,user.password_hash);
         console.log("PASSWORD MATCH:", match); // ✅ TRUE / FALSE
        if(!match)return res.status(401).json({error:'Invalid credentials'});
        const token=jwt.sign({userId:user.id,email:user.email},JWT_SECRET,{expiresIn:'7d'});
        res.json({token,user:{id:user.id,name:user.name,email:user.email,target_role:user.target_role}});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Login failed'});
    } 
}

module.exports={register,login};