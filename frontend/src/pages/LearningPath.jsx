import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useParams } from "react-router-dom";

export default function LearningPath() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [explanations,setExplanations]=useState({});
  const [loadingId,setLoadingId]=useState(null);

  useEffect(()=>{
    api(`/paths/${id}`).then(res=>setItems(res.items));

  },[id]);

  async function explainTopic(item){
   if (item.ai_explanation) return;

   

    const res=await api("/ai/explain","POST",{
    topic:item.topicName,
            userScore:40,
            targetScore:80,
            role:"frontend",
             pathItemId: item.id

    });
 setItems(prev =>
    prev.map(it =>
      it.id === item.id
        ? { ...it, ai_explanation: res.explanation }
        : it
    )
  );
}
  
  return (
    <div>
      <h2>Learning Path</h2>

      <ol>
        {items.map((item, index) => (
          <li key={index} style={{ marginBottom: "1.5rem" }}>
            <strong>{item.topicName}</strong>

            {item.resource ? (
              <>
                {" — "}
                <a
                  href={item.resource.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.resource.title}
                </a>
                {" "}
                ({item.resource.difficulty})
              </>
            ) : (
              <span> — No resource available</span>
            )}

            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={() => explainTopic(item)}>
                Why recommended?
              </button>
            </div>

            {loadingId === item.topicName && (
              <p style={{ color: "gray" }}>Thinking...</p>
            )}

           {item.ai_explanation && (
  <p className="ai-box">
    🤖 {item.ai_explanation}
  </p>
)}
          </li>
        ))}
      </ol>
    </div>
  );

  }
