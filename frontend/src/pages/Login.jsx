import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



async function handleLogin(e) {
  e.preventDefault();

  const data = await api("/auth/login", "POST", {
    email,
    password,
  });

  console.log("LOGIN RESPONSE:", data);

  // ✅ FIX: use data.user & data.token
  login(data.user, data.token);

  // ✅ FIX: redirect based on target_role
  if (data.user.target_role) {
    navigate("/dashboard");
  } else {
    navigate("/select-role");
  }
}


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>AI Learning Path</h1>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">
          Continue your personalized learning journey
        </p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email Address" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <button type="submit">Login</button>
        </form>

        <p
  className="auth-link"
  onClick={() => navigate("/register")}
  style={{ cursor: "pointer" }}
>
  Don't have an account? Register
</p>
      </div>
    </div>

    // <div>
    //   <h2>Login</h2>

    //   {/* ✅ FORM with controlled submit */}
    //   <form onSubmit={handleLogin}>
    //     <input
    //       placeholder="Email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />

    //     <input
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />

    //     {/* ✅ type="submit" WITH preventDefault */}
    //     <button type="submit">Login</button>
    //   </form>
    // </div>
  );
}

