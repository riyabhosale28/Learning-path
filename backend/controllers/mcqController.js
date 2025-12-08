const pool = require("../db");

function getDifficulty(score) {
  if (score < 40) return "beginner";
  if (score <= 70) return "intermediate";
  return "advanced";
}

async function startMcqTest(req, res) {
  try {
    const { skill } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    // 1️⃣ Get skill id
    const [[skillRow]] = await pool.query(
      "SELECT id FROM skills WHERE name = ?",
      [skill.toLowerCase()]
    );

    if (!skillRow) {
      return res.status(404).json({ error: "Skill not found" });
    }

    const skillId = skillRow.id;

    // 2️⃣ Get user's current skill score
    const [[scoreRow]] = await pool.query(
      `
      SELECT score
      FROM user_skills
      WHERE user_id = ? AND skill_id = ?
      `,
      [userId, skillId]
    );

    const currentScore = scoreRow?.score ?? 0;
    const difficulty = getDifficulty(currentScore);

    console.log(
      `MCQ START → User:${userId}, Skill:${skill}, Score:${currentScore}, Difficulty:${difficulty}`
    );

    // 3️⃣ Fetch questions (limit 10)
    const [questions] = await pool.query(
      `
      SELECT 
        id, question,
        option_a, option_b, option_c, option_d
      FROM mcq_questions
      WHERE skill_id = ? AND difficulty = ?
      ORDER BY RAND()
      LIMIT 10
      `,
      [skillId, difficulty]
    );

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ error: "No MCQ questions found for this skill" });
    }

    res.json({
      skill,
      difficulty,
      total: questions.length,
      questions
    });
  } catch (err) {
    console.error("MCQ START ERROR:", err);
    res.status(500).json({ error: "Failed to start MCQ test" });
  }
}


async function submitMcqTest(req, res) {
    console.log("MCQ SUBMIT BODY:", req.body);

  try {
    const { userId, skill, answers } = req.body;

    if (!userId || !skill || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid submission payload" });
    }

    // 1️⃣ Get skill ID
    const [[skillRow]] = await pool.query(
      "SELECT id FROM skills WHERE name = ?",
      [skill.toLowerCase()]
    );
    if (!skillRow) {
      return res.status(404).json({ error: "Skill not found" });
    }
    const skillId = skillRow.id;

    // 2️⃣ Fetch correct answers
    const questionIds = answers.map((a) => a.questionId);

    const [rows] = await pool.query(
      `
      SELECT id, correct_option
      FROM mcq_questions
      WHERE id IN (${questionIds.map(() => "?").join(",")})
      `,
      questionIds
    );

    const correctMap = {};
    rows.forEach((r) => {
      correctMap[r.id] = r.correct_option;
    });

    // 3️⃣ Calculate score
    let correctCount = 0;
    answers.forEach((a) => {
      if (correctMap[a.questionId] === a.selected) {
        correctCount++;
      }
    });

    const total = answers.length;
    const score = Math.round((correctCount / total) * 100);

    // 4️⃣ Insert test record
    const [testRes] = await pool.query(
      `
      INSERT INTO mcq_tests (user_id, skill_id, score, total)
      VALUES (?, ?, ?, ?)
      `,
      [userId, skillId, score, total]
    );

    const testId = testRes.insertId;

    // 5️⃣ Store individual answers (optional analytics)
    for (const a of answers) {
      const isCorrect = correctMap[a.questionId] === a.selected;
      await pool.query(
        `
        INSERT INTO mcq_answers
        (test_id, question_id, selected_option, is_correct)
        VALUES (?, ?, ?, ?)
        `,
        [testId, a.questionId, a.selected, isCorrect]
      );
    }

    // 6️⃣ Update user_skills
    const [[existing]] = await pool.query(
      `
      SELECT score FROM user_skills
      WHERE user_id = ? AND skill_id = ?
      `,
      [userId, skillId]
    );

    const newScore = existing
      ? Math.max(existing.score, score)
      : score;

    await pool.query(
      `
      INSERT INTO user_skills (user_id, skill_id, score)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE score = ?
      `,
      [userId, skillId, newScore, newScore]
    );

    res.json({
      message: "MCQ test submitted successfully",
      score,
      correct: correctCount,
      total,
      updatedSkillScore: newScore
    });
  } catch (err) {
    console.error("MCQ SUBMIT ERROR:", err);
    res.status(500).json({ error: "Failed to submit MCQ test" });
  }
}

module.exports = { startMcqTest };
module.exports = {
  startMcqTest,
  submitMcqTest
};

