import {useContext} from "react";
import {NavLink,useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar(){
    const {user,logout}=useContext(AuthContext);
    const navigate=useNavigate();

    function handleLogout(){
        logout();
        navigate("/login");
    }
    return(
      //   <nav
      //   style={{
      //       display:"flex",
      //       justifyContent:"space-between",
      //       alignItems:"center",
      //       padding:"10px 20px",
      //       borderBottom:"1px solid #ddd",

      //   }}
      //   >
      //       <div>
      //           <Link to={user ? "/dashboard":"/login"} style={{fontWeight:"bold"}}    >
      //           AI Learning Path</Link>       
      //           </div>
      //           {user ? (
      //   <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      //     <Link to="/dashboard">Dashboard</Link>
      //     <Link to="/assessment">Take Assessment</Link>
      //     <Link to="/coach">AI Coach</Link>
      //     <button onClick={handleLogout}>Logout</button>
      //   </div>
      // ) : (
      //   <div style={{ display: "flex", gap: "12px" }}>
      //     <Link to="/login">Login</Link>
      //     <Link to="/register">Register</Link>
      //   </div>
      // )}
      //   </nav>
      <nav className="navbar">
        <div className="logo">🚀
          <span>AI Learning</span>
        </div>
        <div className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
         <NavLink to="/assessment">
          Assessment
        </NavLink>

        <NavLink to="/coach">
          AI Coach
        </NavLink>

        <NavLink to="/mcq">
          MCQ Tests
        </NavLink>

      </div>

      <div className="user-section">

        <div className="user-info">
          <h4>{user?.name}</h4>
          <p>{user?.target_role}</p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

        </div>
      </nav>
    )
}