const OpenAI=require("openai");
const pool=require("../db");
const openai=new OpenAI({
    apiKey:process.env.OPEN_API_KEY,
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
        User Score:${userScore}
        Expected Score:${targetScore}
        
        Explain clearly:
        -why the gap matters
        -how learning this topic helps
        -keep it under 60 words
        `;

        const completion=await openai.chat.completions.create({
            model:"gpt-4o-mini",
            messages:[{role:"user",content:prompt}],
            temperature:0.4,
        });
         const explanation = completion.choices[0].message.content;
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
