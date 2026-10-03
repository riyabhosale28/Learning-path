const Groq=require("groq-sdk");

const pool=require("../db");

const groq=new Groq({
  apiKey:process.env.GROQ_API_KEY,
});

async function coachChat(req,res){
    try{
        const {userId,message}=req.body;

        const[skills]=await pool.query(`
            SELECT s.name, us.score
      FROM user_skills us
      JOIN skills s ON s.id = us.skill_id
      WHERE us.user_id = ?`,[userId]);


      const [path] = await pool.query(`
      SELECT t.name, lpi.priority
      FROM learning_path_items lpi
      JOIN topics t ON t.id = lpi.topic_id
      JOIN learning_paths lp ON lp.id = lpi.path_id
      WHERE lp.user_id = ?
      ORDER BY lp.id DESC
      LIMIT 5
    `, [userId]);

    
    const prompt = `
You are a personal AI learning coach.

User skills:
${skills.map(s => `${s.name}: ${s.score}%`).join("\n")}

Current learning path:
${path.map(p => `- ${p.name} (${p.status || "pending"})`).join("\n")}

User question:
"${message}"

Answer clearly, practically, and briefly.
Suggest next actions when possible.
`;

    const completion=await groq.chat.completions.create({
      messages:[
        {
          role:"user",
          content:prompt,
        },
      ],
      model:"llama-3.3-70b-versatile",
    });
const reply=completion.choices[0].message.content;

// const prompt = messages
//   .map(msg => `${msg.role}: ${msg.content}`)
//   .join("\n");


console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);

    // const reply = reply.choices[0].message.content;

    // ✅ Save chat
    await pool.query(
      "INSERT INTO ai_chat_messages (user_id, role, message) VALUES (?, 'user', ?), (?, 'assistant', ?)",
      [userId, message, userId, reply]
    );

    res.json({ reply });

  } catch (err) {
    console.log("===== ERROR =====");
  console.log(err);
  console.log("Message:", err.message);
  console.log("Cause:", err.cause);

    console.error("AI COACH ERROR:", err);
    res.status(500).json({ error: "AI coach failed" });


    }
}

module.exports = { coachChat };

