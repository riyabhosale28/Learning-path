const pool=require("../db");
async function getLearningPath(req,res){
    try{
        const {id}=req.params;
        


        const [rows]=await pool.query(`SELECT
    lpi.id,
    t.name AS topicName,
    lpi.priority,
    lpi.ai_explanation,
    r.title AS resourceTitle,
    r.url AS resourceUrl,
    r.difficulty AS resourceDifficulty
  FROM learning_path_items lpi
  JOIN topics t ON t.id = lpi.topic_id
  LEFT JOIN resources r ON r.id = lpi.resource_id
  WHERE lpi.path_id = ?
  ORDER BY lpi.priority DESC`,[id]);

//             const items = rows.map(r => ({
//   id: r.id,
//   topicName: r.topicName,
//   priority: r.priority,
//   ai_explanation: r.ai_explanation,
//   resource: r.resourceTitle ? {
//     title: r.resourceTitle,
//     url: r.resourceUrl,
//     difficulty: r.resourceDifficulty
//   } : null
// }));

const items = rows.map(r => ({
  id: r.id,
  topicId: r.topic_id,   // add this
  topicName: r.topicName,
  priority: r.priority,
  ai_explanation: r.ai_explanation,
  resource: r.resourceTitle ? {
    title: r.resourceTitle,
    url: r.resourceUrl,
    difficulty: r.resourceDifficulty
  } : null
}));

            res.json({items});
    }catch(err){
        console.error("PATH FETCH ERROR:",err);
        res.status(500).json({error:"failed to load learning path"});
    }
}

module.exports={getLearningPath};