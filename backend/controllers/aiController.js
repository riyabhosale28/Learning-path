const { GoogleGenerativeAI}=require("@google/generative-ai");

const pool=require("../db");
const genAi=new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

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

        const model = genAi.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const result = await model.generateContent(prompt);

const explanation = result.response.text();
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
