/*import {useState,useContext} from "react";
import {api} from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){
    const {user}=useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [pathId,setPathId]=useState(null);

    async function generatePath(){
        const res=await api("/recommend","POST",{userId:user.id});
        setPathId(res.pathId);
    }

    return(
        <div>
            <h2>Dashboard</h2>
            <button onClick={generatePath}>Generate Learning Path</button>

            {pathId &&(
                <Link to={`/path/${pathId}`}>
                    View Learning Path
                </Link>
            )}
        </div>
    );
}*/


import { useContext, useState,useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user.target_role) {
      navigate("/select-role", { replace: true });
    }
  }, [user, navigate]);

  if (!user.target_role) return null;

  async function generatePath() {
    try {
      setLoading(true);
      const res = await api("/recommend", "POST", {
        userId: user.id,
        desiredRole: user.target_role || "frontend",
      });
      navigate(`/path/${res.pathId}`);
    } catch (err) {
      alert("Failed to generate learning path");
    } finally {
      setLoading(false);
    }


  }

  return (
   
  <div className="dashboard-container">
    <div className="dashboard-header">
      <h1>Welcome, {user.name} 👋</h1>
      <p>This dashboard helps you track and grow your skills.</p>
    </div>

    <div className="dashboard-grid">
      {/* Learning Path Card */}
      <div className="card">
        <h3>📚 Personalized Learning Path</h3>
        <p>
          Based on your skill assessment, we generate a step-by-step roadmap
          tailored to your career goals.
        </p>
        <button onClick={generatePath} disabled={loading}>
          {loading ? "Generating..." : "Generate Learning Path"}
        </button>
      </div>

      {/* AI Coach Card */}
      <div className="card">
        <h3>🤖 AI Learning Coach</h3>
        <p>
          Get instant guidance and answers based on your learning progress.
        </p>
        <button onClick={() => navigate("/coach")}>
          Talk to AI Coach
        </button>
      </div>
      <div className="card">
  <h3>📝 MCQ Skill Tests</h3>
  <p>
    Validate your skills with short MCQ-based assessments.
    Your learning path updates based on results.
  </p>
  <button onClick={() => navigate("/mcq")}>
    Start MCQ Tests
  </button>
</div>

    </div>
  </div>
);

}


