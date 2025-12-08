import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function McqTest() {
  const { skill } = useParams(); // /mcq/test/:skill
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const q = questions[currentIndex];

    // remove previous answer for this question
    const updated = answers.filter(
      (a) => a.questionId !== q.id
    );

    updated.push({
      questionId: q.id,
      selected: option
    });

    setAnswers(updated);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  // ✅ SUBMIT TEST (THIS FIXES YOUR ERROR)
  async function submitTest() {
    if (answers.length === 0) {
      alert("Answer at least one question");
      return;
    }

    try {
      const res = await api("/mcq/submit", "POST", {
        userId: user.id,
        skill: skill,
        answers: answers
      });

      alert(`Test submitted! Score: ${res.score}%`);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to submit MCQ test");
    }
  }

  if (loading) return <p>Loading MCQ...</p>;
  if (!questions.length) return <p>No questions available.</p>;

  const q = questions[currentIndex];

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>MCQ Test: {skill.toUpperCase()}</h2>
      <p>
        Question {currentIndex + 1} / {questions.length}
      </p>

      <h3>{q.question}</h3>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => selectOption("A")}>
          A. {q.option_a}
        </button>
        <br />
        <button onClick={() => selectOption("B")}>
          B. {q.option_b}
        </button>
        <br />
        <button onClick={() => selectOption("C")}>
          C. {q.option_c}
        </button>
        <br />
        <button onClick={() => selectOption("D")}>
          D. {q.option_d}
        </button>
      </div>

      {currentIndex === questions.length - 1 && (
        <button
          onClick={submitTest}
          style={{ marginTop: "20px" }}
        >
          Submit Test
        </button>
      )}
    </div>
  );
}
