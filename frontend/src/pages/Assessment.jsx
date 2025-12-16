/*import {useState,useContext,useMemo} from "react";
import {api} from "../api/api";
import { AuthContext } from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

export default function Assessment(){
    const {user} =useContext(AuthContext);
    
    const nav=useNavigate();

    d;

    const [skills,setSkills]=useState({
    javascript:50,
    react:40,
    node:40,
    sql:30,
    algorithms:20
    }
);

function update(skill,val){
    setSkills({...skills,[skill]:val});

}
async function submit(){
    const arr=Object.entries(skills).map(([skill,score])=>({skill,score}));
    await api("/assess","POST",{userId:user.id,skillScores:arr});
    nav("/dashboard");
}
return(
    <div>
        <h2>Skill Assessment</h2>
        <h3>Tell us, what exactly you know</h3>
        {Object.keys(skills).map(s=>(
            <div key={s}>
                {s}:{skills[s]}
                <input type="range" min="0" max="100" value={skills[s]}
                onChange={e=>update(s,Number(e.target.value))}/>
        
    </div>
    ))}
    <button onClick={submit}>Submit</button>
    </div>
);
}*/

// frontend/src/pages/Assessment.jsx
import { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import ROLE_CONFIG from "../config/roles";

export default function Assessment() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1️⃣ if user somehow reached here without role, send them to select-role
  const roleKey = user?.target_role || "frontend";
  const roleInfo = ROLE_CONFIG[roleKey] || ROLE_CONFIG.frontend;

  // 2️⃣ scores state: object like { javascript: 50, react: 40, ... }
  const [scores, setScores] = useState(() => {
    const initial = {};
    roleInfo.skills.forEach((s) => {
      initial[s] = 50; // default mid value
    });
    return initial;
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(skill, value) {
    setScores((prev) => ({
      ...prev,
      [skill]: Number(value),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);

      // 3️⃣ build payload for backend
      const skillScores = roleInfo.skills.map((skill) => ({
        skill,
        score: scores[skill] ?? 0,
      }));

      const payload = {
        userId: user.id,
        skillScores,
      };

      console.log("ASSESSMENT PAYLOAD:", payload);

      const res = await api("/assess", "POST", payload);
      console.log("ASSESSMENT RESPONSE:", res);

      // after successful save → go to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("ASSESSMENT ERROR:", err);
      alert("Failed to submit assessment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="assessment-container">
      <h2>Skill Assessment – {roleInfo.label}</h2>
      <p className="muted">
        Tell us how confident you feel in each skill. We'll use this to build
        your personalized learning path.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="slider-list">
          {roleInfo.skills.map((skill) => (
            <div key={skill} className="slider-row">
              <label>
                {skill.toUpperCase()} : {scores[skill]}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={scores[skill]}
                onChange={(e) => handleChange(skill, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save & View Dashboard"}
        </button>
      </form>
    </div>
  );
}
