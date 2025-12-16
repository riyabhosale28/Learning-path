import { useState, useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";



const ROLES = [
  {
    key: "frontend",
    title: "Frontend Developer",
    desc: "UI development using JavaScript, React, CSS"
  },
  {
    key: "backend",
    title: "Backend Developer",
    desc: "APIs, databases, server-side logic"
  },
  {
    key: "fullstack",
    title: "Full Stack Developer",
    desc: "Frontend + Backend development"
  },
  {
    key: "analyst",
    title: "Data Analyst",
    desc: "Data analysis using SQL & statistics"
  }
];

export default function SelectRole() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  


  useEffect(() => {
  if (user?.target_role) {
    navigate("/dashboard",{replace:true});
  }
}, [user,navigate ]);

if(!user){
  return <h3>Loading user...</h3>
}

  async function handleContinue() {
    if (!selectedRole) return;

    try {
      setLoading(true);

      await api("/role/role", "POST", {
        userId: user.id,
        role: selectedRole
      });

      // update user in context
     setUser((prev) => ({ ...prev, target_role: selectedRole }));

setTimeout(() => {
  navigate("/dashboard");
}, 200);

    } catch (err) {
      alert("Failed to save role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="role-container">
      <h2>Choose Your Career Path</h2>
      <p className="muted">
        This helps us personalize your assessment and learning journey.
      </p>

      <div className="role-grid">
        {ROLES.map((r) => (
          <div
            key={r.key}
            className={`role-card ${
              selectedRole === r.key ? "active" : ""
            }`}
            onClick={() => setSelectedRole(r.key)}
          >
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
          </div>
        ))}
      </div>

      <button
        disabled={!selectedRole || loading}
        onClick={handleContinue}
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
   