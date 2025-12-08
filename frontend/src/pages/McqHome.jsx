import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function McqHome() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ basic skill list (later make role-based)
  const skills = [
    { key: "sql", label: "SQL" },
    { key: "javascript", label: "JavaScript" },
    { key: "react", label: "React" },
    { key: "node", label: "Node.js" }
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>MCQ Skill Tests</h2>
      <p>Test your skills and improve your learning path.</p>

      <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
        {skills.map((s) => (
          <div key={s.key} className="card">
            <h3>{s.label}</h3>
            <p>Take a short MCQ test to evaluate your knowledge.</p>
            <button onClick={() => navigate(`/mcq/test/${s.key}`)}>
              Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
