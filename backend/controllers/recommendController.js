const pool = require("../db");
const ROLE_TARGETS = {
  frontend: { javascript: 85, react: 80, css: 70, html: 70 },
  backend: { node: 80, sql: 75, algorithms: 60 },
  fullstack: { javascript: 80, node: 75, react: 75, sql: 70 },
  analyst: { sql: 80, statistics: 75 },
};
function difficultyRank(d) {
  return { beginner: 1, intermediate: 2, advanced: 3 }[d] || 2;
}
async function generateRecommendations(req, res) {
  try {
    const { userId, maxTopics = 6 } = req.body;

    // 1️⃣ get user's selected role
    const [[userRow]] = await pool.query(
      "SELECT target_role FROM users WHERE id = ?",
      [userId]
    );

    const desiredRole = userRow?.target_role || "frontend";
    const targets = ROLE_TARGETS[desiredRole] || ROLE_TARGETS["frontend"];
    const [userSkillRows] = await pool.query(
      `
            SELECT s.name  as skill,us.score From user_skills us JOIN skills s on s.id=us.skill_id where us.user_id=?`,
      [userId]
    );

    const userScores = {};
    userSkillRows.forEach((r) => (userScores[r.skill] = r.score));
    const [topicSkillRows] = await pool.query(
      /*`
           SELECT t.id as topic_id,t.name as topic_name,ts.weight,s.name as skill from topics t JOIN topic_skills ts ON t.id=ts.topic_id JOIN skills s ON s.id=ts.skill_id`*/
      `SELECT 
  t.id AS topic_id,
  t.name AS topic_name,
  t.difficulty AS topic_difficulty,
  ts.weight,
  s.name AS skill
FROM topics t
JOIN topic_skills ts ON t.id = ts.topic_id
JOIN skills s ON s.id = ts.skill_id
`
    );

    console.log("USER SCORES:", userScores);
    const topicsMap = {};
    for (const r of topicSkillRows) {
      if (!topicsMap[r.topic_id])
        topicsMap[r.topic_id] = {
          id: r.topic_id,
          name: r.topic_name,
          difficulty: r.topic_difficulty,
          skills: [],
        };
      topicsMap[r.topic_id].skills.push({
        skill: r.skill,
        weight: Number(r.weight) || 1,
      });
    }
    const topicScores = [];
    for (const id in topicsMap) {
      const topic = topicsMap[id];
      let priority = 0;
      for (const req of topic.skills) {
        const user = Number(userScores[req.skill]) || 0;
        const target = Number(targets?.[req.skill]) || 70;
        const gap = target - user;
        if (gap <= 0) {
          continue;
        }
        priority += (gap / 100) * req.weight;
      }
      topicScores.push({
        topicId: topic.id,
        topicName: topic.name,
        priority,
        skills: topic.skills,
        topicDifficulty: topic.difficulty,
      });
    }

    const filtered=topicScores.filter(t=>t.priority>0);
    filtered.sort((a,b)=>b.priority-a.priority);

    const selected = filtered.slice(0,maxTopics);

    const pathItems = [];
    for (const t of selected) {
      /*const avgUserScore=Object.values(userScores).length? Object.values(userScores).reduce((a,b)=>a+b,0)/Object.values(userScores).length:50;
            const desiredDifficultyOrder=Math.ceil((avgUserScore||50)/40);*/
      const topicSkillScores = t.skills.map((s) => userScores[s.skill] ?? 0);

      const avgTopicScore = topicSkillScores.length
        ? topicSkillScores.reduce((a, b) => a + b, 0) / topicSkillScores.length
        : 50;

      const skillBasedDifficulty =
        avgTopicScore >= 80 ? 3 : avgTopicScore >= 50 ? 2 : 1;

      const topicBasedDifficulty = difficultyRank(t.topicDifficulty);

      // ✅ take the harder one
      const desiredDifficultyOrder = Math.max(
        skillBasedDifficulty,
        topicBasedDifficulty
      );
      // beginner

      const [resources] = await pool.query(
        `
                SELECT r.*
                FROM topic_resources tr
                JOIN resources r ON r.id=tr.resource_id
                WHERE tr.topic_id=?`,
        [t.topicId]
      );

      let chosen = null;
      let bestDiff = 999;
      for (const r of resources) {
        const dRank = difficultyRank(r.difficulty);
        const diff = Math.abs(dRank - desiredDifficultyOrder);
        if (diff < bestDiff) {
          bestDiff = diff;
          chosen = r;
        }
      }
      pathItems.push({
        topicId: t.topicId,
        topicName: t.topicName,
        priority: t.priority,
        resource: chosen,
      });
    }

    const [pathInsert] = await pool.query(
      "INSERT INTO learning_paths(user_id)VALUES(?)",
      [userId]
    );
    const pathId = pathInsert.insertId;
    for (const p of pathItems) {
      await pool.query(
        "INSERT INTO learning_path_items(path_id,topic_id,priority,resource_id)VALUES(?,?,?,?)",
        [pathId, p.topicId, p.priority, p.resource?.id || null]
      );
    }
    res.json({ pathId, items: pathItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recommendation generation failed" });
  }
}

module.exports = { generateRecommendations };
