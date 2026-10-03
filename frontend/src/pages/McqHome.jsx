import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./McqHome.css";
export default function McqHome() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const ROLE_SKILLS={
    frontend:[
      {key:"javascript",label:"JavaScript"},
      {key:"react",label:"React"},
      {key:"html", label: "HTML"},
       { key: "css", label: "CSS" }

    ],
    backend: [
      { key: "node", label: "Node.js" },
      { key: "sql", label: "SQL" },
      { key: "mongodb", label: "MongoDB" },
      { key: "apis", label: "REST APIs" }
    ],
     analyst: [
      { key: "sql", label: "SQL" },
      { key: "python", label: "Python" },
      { key: "statistics", label: "Statistics" },
      { key: "powerbi", label: "Power BI" }
    ],

    fullstack: [
      { key: "html", label: "HTML" },
      { key: "css", label: "CSS" },
      { key: "javascript", label: "JavaScript" },
      { key: "react", label: "React" },
      { key: "node", label: "Node.js" },
      { key: "sql", label: "SQL" }
    ]
  };

   const skills =
    ROLE_SKILLS[user.target_role] || [];

  return (
    // <div style={{ maxWidth: "800px", margin: "40px auto" }}>
    //   <h2>MCQ Skill Tests</h2>
    //   <p>Test your skills and improve your learning path.</p>

    //   <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
    //     {skills.map((s) => (
    //       <div key={s.key} className="card">
    //         <h3>{s.label}</h3>
    //         <p>Take a short MCQ test to evaluate your knowledge.</p>
    //         <button onClick={() => navigate(`/mcq/test/${s.key}`)}>
    //           Start Test
    //         </button>
    //       </div>
    //     ))}
    //   </div>
    // </div>

    <div className="mcq-home">

      <div className="mcq-header">

        <h1>📝 Skill Assessments</h1>

        <p>
          Test your knowledge and improve your
          personalized learning path.
        </p>

      </div>

      <div className="mcq-grid">

        {skills.map((skill) => (

          <div
            className="mcq-card"
            key={skill.key}
          >

            <h2>{skill.label}</h2>

            <p>10 Questions</p>

            <p>⏱ 10 Minutes</p>

            <button
              onClick={() =>
                navigate(`/mcq/test/${skill.key}`)
              }
            >
              Start Test
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}
