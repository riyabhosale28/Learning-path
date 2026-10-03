const Groq=require("groq-sdk");

const pool=require("../db");
const groq=new Groq({
    apiKey:process.env.GROQ_API_KEY,
});

async function explainTopic(req,res){
    try{
        const {topic,userScore,targetScore,role,pathItemId}=req.body;
        const [rows] = await pool.query(
      "SELECT ai_explanation FROM learning_path_items WHERE id = ?",
      [pathItemId]
    );

    if (rows.length && rows[0].ai_explanation) {
      return res.json({ explanation: rows[0].ai_explanation });
    }


        const prompt=`You are an AI learning advisor.
        Explain in simple and encouraging language why this topic is recommened.
        Role:${role}
        Topic:${topic}
        // User Score:${userScore}
        // Expected Score:${targetScore}
        
        Explain specifically for the topic "${topic}".

// Role: ${role}

// Current score: ${userScore}
// Target score: ${targetScore}

Explain:
- why this topic is important for the role
- what practical skills the user will gain
- how learning it improves career readiness

Keep it under 50 words.
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
const explanation=completion.choices[0].message.content;
         await pool.query(
      "UPDATE learning_path_items SET ai_explanation = ? WHERE id = ?",
      [explanation, pathItemId]
    );
        res.json({
          explanation

        });

    }catch(err){
        console.error("AI ERROR:",err);
        res.status(500).json({error:"AI explanation failed"});

    }
}

module.exports={explainTopic};
