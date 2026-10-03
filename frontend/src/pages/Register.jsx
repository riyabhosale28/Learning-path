import {useState} from "react";
import {api} from "../api/api";
import {useNavigate} from "react-router-dom";
import "./Auth.css";
export default function Register(){
    const nav=useNavigate();
    const [form,setForm]=useState({name:"",email:"",password:""});

    async function register(){
        await api("/auth/register","POST",{...form,desired_role:"frontend"});
       alert("🎉 Registration successful! Please login.");
        nav("/login");

    }

    return(
        // <div>
        //     <h2>Register</h2>
        //     <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
        //     <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
        //     <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
        //     <button onClick={register}>Register</button>
        // </div>

        <div className="auth-page">
            <div className="auth-card">
                <h1>AI Learning Path</h1>
                <h2>Create Account</h2>
                <p className="auth-subtitle">
                    Start your personalized learning experience 
                </p>
                <form onSubmit={(e)=>{e.preventDefault();
                    register();
                }}>
                    <input
  type="text"
  placeholder="Full Name"
  value={form.name}
  onChange={(e) =>
    setForm({ ...form, name: e.target.value })
  }
/>
                     <input
  type="email"
  placeholder="Email Address"
  value={form.email}
  onChange={(e) =>
    setForm({ ...form, email: e.target.value })
  }
/>

                   <input
  type="password"
  placeholder="Password"
  value={form.password}
  onChange={(e) =>
    setForm({ ...form, password: e.target.value })
  }
/>
                    <button type="submit">Register</button>
                </form>
                  <p className="auth-link">
  Already have an account?{" "}
  <span onClick={() => nav("/login")}>
    Login
  </span>
</p>
            </div>
        </div>
    );
}