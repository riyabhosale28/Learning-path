/*const pool=require('../db');

async function  submitAssessment(req,res) {
    try{
        console.log("ASSESSMENT BODY:", req.body);
        const {userId,skillScores}=req.body;
        for(const s of skillScores){
            const [skillRows]=await pool.query('SELECT id FROM skills where name=?',[s.skill]);
            if(!skillRows.length)continue;
            const skillId=skillRows[0].id;
            const [existing]=await pool.query('SELECT id FROM user_skills where user_id=? AND skill_id=?',[userId,skillId]);
            if(existing.length){
                await pool.query('UPDATE user_skills SET score=?',[s.score,existing[0].id]);

            }else{
                await pool.query('INSERT into user_skills (user_id,skill_id,score)VALUES(?,?,?)',[userId,skillId,s.score]);

            }
        }
        res.json({success:true});
    }catch(err){
        console.error(err);
        res.status(500).jso({error:'Assessment submission failed'});

    }
    
}


module.exports={submitAssessment};*/


/*const pool = require("../db");

async function submitAssessment(req, res) {
  try {
    console.log("ASSESSMENT BODY:", req.body);

    const { userId, skillScores } = req.body;

    if (!userId || !Array.isArray(skillScores)) {
      return res.status(400).json({ error: "Invalid assessment data" });
    }

    // ✅ Remove old assessment
    await pool.query(
      "DELETE FROM user_skills WHERE user_id = ?",
      [userId]
    );

    // ✅ Insert new skill scores
    for (const s of skillScores) {
      await pool.query(
        "INSERT INTO user_skills (user_id, skill, score) VALUES (?, ?, ?)",
        [userId, s.skill, s.score]
      );
    }

    res.json({ success: true });

  } catch (err) {
    console.error("ASSESSMENT ERROR:", err);
    res.status(500).json({ error: "Assessment submission failed" });
  }
}

module.exports = { submitAssessment };


*/


// controllers/assessmentController.js
/*exports.submitAssessment = async (req, res) => {
  try {
    const { userId, skillScores } = req.body;

    for (const item of skillScores) {
      const [[skill]] = await pool.query(
        "SELECT id FROM skills WHERE name = ?",
        [item.skill]
      );

      if (!skill) continue;

      await pool.query(
        `
        INSERT INTO user_skills (user_id, skill_id, score)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE score = VALUES(score)
        `,
        [userId, skill.id, item.score]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("ASSESSMENT ERROR:", err);
    res.status(500).json({ error: "Assessment failed" });
  }
};*/


const pool = require("../db");

async function submitAssessment(req, res) {
  try {
    const { userId, skillScores } = req.body;

    if (!userId || !Array.isArray(skillScores)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    for (const item of skillScores) {
      console.log("ASSESSMENT ITEM:", item);

      const [rows] = await pool.query(
        "SELECT id FROM skills WHERE name = ?",
        [item.skill.toLowerCase()]
      );

      const skill = rows[0];
      console.log("FOUND SKILL:", skill);

      if (!skill) {
        console.log("❌ Skill not found:", item.skill);
        continue;
      }

      await pool.query(
        `
        INSERT INTO user_skills (user_id, skill_id, score)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE score = VALUES(score)
        `,
        [userId, skill.id, item.score]
      );

      console.log("✅ Inserted:", userId, skill.id, item.score);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("ASSESSMENT ERROR:", err);
    res.status(500).json({ error: "Assessment failed" });
  }
}

module.exports = { submitAssessment };
