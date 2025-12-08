require("dotenv").config();

const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const pool = require("./db");
const db = require("./db");
dotenv.config();
const authRoutes=require('./routes/auth');
const assessmentRoutes=require('./routes/assessment');
const recommendRoutes=require('./routes/recommend');
const pathRoutes=require('./routes/path');
const aiRoutes=require("./routes/ai");
const aiCoachRoutes = require("./routes/aiCoach");
const mcqRoutes = require("./routes/mcq");
const userRoleRoutes=require("./routes/userRole")

const app=express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed", err.message);
  }
})();

app.use('/api/auth',authRoutes);
app.use('/api/assess',assessmentRoutes);
app.use('/api/recommend',recommendRoutes);
app.use('/api/paths',pathRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/ai", aiCoachRoutes);
app.use("/api/mcq", mcqRoutes);
app.use("/api/role",userRoleRoutes);

const PORT=process.env.PORT||4000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));



