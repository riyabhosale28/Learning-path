import {useState,useContext,useEffect,useRef} from "react";
import {api} from "../api/api"  ;
import { AuthContext } from "../context/AuthContext";
import "./AICoach.css";

export default function AICoach(){
    const {user}=useContext(AuthContext);
    const [messages,setMessages]=useState([]);
    const [input,setInput]=useState("");
    const [loading,setLoading]=useState(false);

    const chatEndRef=useRef(null);

    useEffect(()=>{
        chatEndRef.current?.scrollIntoView({
            behavior:"smooth",
        });
    },[messages,loading]);

    async function send(){
        if(!input.trim())return;

        const userMessage=input;
        setMessages(prev=>[...prev,{role:"user",text:userMessage,},]);
        setInput("");
        setLoading(true);
try{


        const res=await api("/ai/coach","POST",{
            userId:user.id,
            message:userMessage,
        });
       setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: res.reply,
      },
    ]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: "❌ Sorry, I couldn't respond right now. Please try again.",
      },
    ]);
  } finally {
    setLoading(false);
  }
}
    return(
        // <div>
        //     <h2>AI Learning Coach</h2>
        //     <div style={{border:"1px solid #ccc",padding:"10px",height:"300px",overflow:"auto"}}>
        //         {messages.map((m,i)=>(
        //             <p key={i}>
        //                 <strong>{m.role==="user" ? "You":"Coach"}:</strong>{m.text}
        //             </p>
        //         ))}
        //         {loading && <p>Coach is thinking...</p>}
        //     </div>
        //     <input value={input} onChange={e=>setInput(e.target.value)}
        //     placeholder="Ask your learning Coach..." />
        //     <button onClick={send}>Send</button>
        // </div>
        <div className="coach-container">
            <div className="coach-header">
                <h2>🤖 AI Learning Coach</h2>
                <p>Ask anything about your learning path,career roadmap,or recommend topics.</p>
            </div>
            <div className="suggestions"><button onClick={()=>setInput("How can I improve my SQL skills?")}>SQL Skills</button>
                                         <button onClick={()=>setInput("Explain React Hooks.")}>React</button>
                                         <button onClick={()=>setInput("What should I learn next?")}>Next Topic</button>
            </div>   
            <div className="chat-box">
                {messages.length===0 && (<div className="empty-chat">
                    <h3>👋 Welcome!</h3>
                    <p>I'm your AI learning coach, Ask me anything about your learning journey.</p>
                </div>    
                )}
                {messages.map((m,index)=>(
                    <div key={index} className={m.role==="user" ? "message user-message" : "message ai-message" }>
                        <strong>{m.role==="user" ? "👤 You":"🤖 Coach"}</strong>
                        <p>{m.text}</p>
                        </div>
                ))} 
                {loading && (
                    <div className="message ai-message">
                        🤖 Coach is thinking...
                        </div>
                )}  
                <div ref={chatEndRef}></div>                   
        </div>
        <div className="input-area">
            <input value={input} onChange={(e)=>setInput(e.target.value)}
            placeholder="Ask Your AI Learning Coach..." onKeyDown={(e)=>{ if (e.key==="Enter")send();

            }}
            />
            <button onClick={send}>Send</button>
        </div>
        </div>
    
    );
}