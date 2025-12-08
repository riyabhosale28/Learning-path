import {useState} from "react";
import {api} from "../api/api";
import {useNavigate} from "react-router-dom";

export default function Register(){
    const nav=useNavigate();
    const [form,setForm]=useState({name:"",email:"",password:""});

    async function register(){
        await api("/auth/register","POST",{...form,esired_role:"frontend"});
        alert("Registered!Login now.");
        nav("/");

    }

    return(
        <div>
            <h2>Register</h2>
            <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
            <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
            <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
            <button onClick={register}>Register</button>
        </div>
    );
}