import {useState,useContext} from "react";
import {api} from "../api/api";
import { AuthContext } from "../context/AuthContext";
import {useNavigate} from "react-router-dom";


export default function Assessment(){
    const {user} =useContext(AuthContext);
    const nav=useNavigate();

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
}