import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "./McqTest.css";
export default function McqTest() {
  const { skill } = useParams(); // /mcq/test/:skill
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result,setResult]=useState(null);
  const [selectedOption,setSelectedOption]=useState("");

  // ✅ Fetch MCQ questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await api(
          `/mcq/start/${skill}?userId=${user.id}`
        );
        setQuestions(res.questions);
      } catch (err) {
        alert("Failed to load MCQ questions");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [skill, user.id]);

function selectOption(option) {
  setSelectedOption(option);

  const q = questions[currentIndex];

  const updated = answers.filter(
    a => a.questionId !== q.id
  );

  updated.push({
    questionId: q.id,
    selected: option
  });

  setAnswers(updated);

  setTimeout(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption("");
    }
  }, 400);
}

  
  async function submitTest() {
    if (answers.length === 0) {
      alert("Answer at least one question");
      return;
    }

    try {
     const res = await api("/mcq/submit","POST",{
    userId:user.id,
    skill,
    answers
});

setResult(res);
    } catch (err) {
      alert("Failed to submit MCQ test");
    }
  }

  if (loading) return <p>Loading MCQ...</p>;
  if (!questions.length) return <p>No questions available.</p>;
  if (result) {
  return (
    <div className="result-container">

      <h1>🎉 Assessment Complete</h1>

      <h2>{skill.toUpperCase()}</h2>

      <div className="score-circle">
        {result.score}%
      </div>

      <p>
        ✅ Correct: {result.correct}/{result.total}
      </p>

      <p>
        ❌ Wrong: {result.wrong}
      </p>

      <p>
        📈 Updated Skill Score:
        <strong> {result.updatedSkillScore}</strong>
      </p>

      <hr />

      <h3>Incorrect Answers</h3>

      {result.wrongAnswers.length===0 ? (

        <p>🎉 Perfect Score!</p>

      ) : (

        result.wrongAnswers.map((w,index)=>(
          <div
            key={index}
            className="wrong-card"
          >

            <h4>{w.question}</h4>

            <p>
              <strong>Your Answer:</strong> {w.selected}
            </p>

            <p>
              <strong>Correct Answer:</strong> {w.correct}
            </p>

            <p>{w.explanation}</p>

          </div>
        ))

      )}

      <button onClick={()=>navigate("/dashboard")}>
        Dashboard
      </button>

    </div>
  );
}
  const q = questions[currentIndex];
  return (
  <div className="test-container">

    <div className="test-header">
      <h1>{skill.toUpperCase()} Assessment</h1>

      <p>
        Question {currentIndex + 1} of {questions.length}
      </p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`
          }}
        />
      </div>
    </div>

    <div className="question-card">

      <h2>{q.question}</h2>

      <div className="options">

        <button
  className={`option-btn ${
    selectedOption === "A" ? "selected" : ""
  }`}
  onClick={() => selectOption("A")}
>
  <strong>A.</strong> {q.option_a}
</button>

        <button
  className={`option-btn ${
    selectedOption === "B" ? "selected" : ""
  }`}
  onClick={() => selectOption("B")}
>
  <strong>B.</strong> {q.option_b}
</button>
<button
  className={`option-btn ${
    selectedOption === "C" ? "selected" : ""
  }`}
  onClick={() => selectOption("C")}
>
  <strong>C.</strong> {q.option_c}
</button>
<button
  className={`option-btn ${
    selectedOption === "D" ? "selected" : ""
  }`}
  onClick={() => selectOption("D")}
>
  <strong>D.</strong> {q.option_d}
</button>

      </div>

      {currentIndex === questions.length - 1 && (
        <button
          className="submit-test"
          onClick={submitTest}
        >
          Finish Assessment
        </button>
      )}

    </div>

  </div>
);

 

}
