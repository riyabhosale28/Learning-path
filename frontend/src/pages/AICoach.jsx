import {useState,useContext} from "react";
import {api} from "../api/api"  ;
import { AuthContext } from "../context/AuthContext";

export default function AICoach(){
    const {user}=useContext(AuthContext);
    const [messages,setMessages]=useState([]);
    const [input,setInput]=useState("");
    const [loading,setLoading]=useState(false);

    async function send(){
        if(!input.trim())return;

        const userMsg={role:"user",text:input};
        setMessages(prev=>[...prev,userMsg]);
        setInput("");
        setLoading(true);

        const res=await api("/ai/coach","POST",{
            userId:user.id,
            message:userMsg.text
        });
        setMessages(prev=>[
            ...prev,
            {role:"assistant",text:res.reply}
        ]);
        setLoading(false);
    }
    return(
        <div>
            <h2>AI Learning Coach</h2>
            <div style={{border:"1px solid #ccc",padding:"10px",height:"300px",overflow:"auto"}}>
                {messages.map((m,i)=>(
                    <p key={i}>
                        <strong>{m.role==="user" ? "You":"Coach"}:</strong>{m.text}
                    </p>
                ))}
                {loading && <p>Coach is thinking...</p>}
            </div>
            <input value={input} onChange={e=>setInput(e.target.value)}
            placeholder="Ask your learning Coach..." />
            <button onClick={send}>Send</button>
        </div>
    );
}