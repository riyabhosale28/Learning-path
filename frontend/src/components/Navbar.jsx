import {useContext} from "react";
import {Link,useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export default function Navbar(){
    const {user,logout}=useContext(AuthContext);
    const navigate=useNavigate();

    function handleLogout(){
        logout();
        navigate("/login");
    }
    return(
        <nav
        style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            padding:"10px 20px",
            borderBottom:"1px solid #ddd",

        }}
        >
            <div>
                <Link to={user ? "/dashboard":"/login"} style={{fontWeight:"bold"}}    >
                AI Learning Path</Link>       
                </div>
                {user ? (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/coach">AI Coach</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
        </nav>
    )
}