import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault(); // ✅ VERY IMPORTANT (stops page reload)

    console.log("Login clicked"); // ✅ debug

    const data = await api("/auth/login", "POST", {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", data); // ✅ must appear

    if (data.token) {
      login(data.user, data.token);
      navigate("/select-role");
    } else {
      alert("Invalid login");
    }
  
  /*if (user.target_role) {
  navigate("/dashboard");
} else {
  navigate("/select-role");
}*/
  }


  return (
    <div>
      <h2>Login</h2>

      {/* ✅ FORM with controlled submit */}
      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ type="submit" WITH preventDefault */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

