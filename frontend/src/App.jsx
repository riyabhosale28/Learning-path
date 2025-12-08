import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import LearningPath from "./pages/LearningPath";
import ProtectedRoute from "./components/ProtectedRoute";
import AICoach from "./pages/AICoach";
import McqTest from "./pages/McqTest";
import McqHome from "./pages/McqHome";
import SelectRole from "./pages/SelectRole";



export default function App(){
  return(
  <div>
    <Navbar />
    <main >

    
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>} />
      <Route
        path="/assessment"
        element={
          <ProtectedRoute>
            <Assessment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    
<Route
        path="/path/:id"
        element={
          <ProtectedRoute>
            <LearningPath />
          </ProtectedRoute>
        }
      />
<Route path="/coach"      
element={<AICoach />} />
<Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<h2>404 – Page not found</h2>} />

<Route
  path="/mcq"
  element={
    <ProtectedRoute>
      <McqHome />
    </ProtectedRoute>
  }
/>
          <Route
  path="/mcq/test/:skill"
  element={
    <ProtectedRoute>
      <McqTest />
    </ProtectedRoute>
  }
/>
<Route
  path="/select-role"
  element={
    <ProtectedRoute>
      <SelectRole />
    </ProtectedRoute>
  }
/>


    </Routes>
    </main>
    </div>
  );
}   