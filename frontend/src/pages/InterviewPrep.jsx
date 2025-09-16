/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "../components/Navbar";

const InterviewPrep = () => {
  const [technology, setTechnology] = useState("");
  const [experience, setExperience] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchQuestions = async () => {
    setIsLoading(true);
    setQuestions([]);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    try {
      const response = await fetch(`${API_BASE}/api/interview-prep`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experience,
          position: technology,
        }),
      });
      const data = await response.json();

      // Robustly extract an array of question objects from possibly noisy text
      let raw = data.questions;
      console.log("Fetched questions:", raw);

      const tryParseArray = (text) => {
        if (typeof text !== "string") return Array.isArray(text) ? text : [];
        // Remove fenced code blocks while keeping inner content
        let cleaned = text
          .replace(/^```json\s*[\r\n]?/i, "")
          .replace(/^```\w*\s*[\r\n]?/i, "")
          .replace(/```\s*$/i, "");
        // If still contains prose, attempt to extract first JSON array
        let match = cleaned.match(/\[[\s\S]*\]/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch (_) {
            // fall through
          }
        }
        // Last attempt: direct parse
        try {
          return JSON.parse(cleaned);
        } catch (_) {
          return [];
        }
      };

      let parsed = tryParseArray(raw);

      // Normalize options to have text and isCorrect
      const normalized = Array.isArray(parsed)
        ? parsed.map((q, idx) => ({
            id: idx + 1,
            question: q.question,
            options: Array.isArray(q.options)
              ? q.options.map((opt) => ({
                  text: opt,
                  isCorrect: opt === q.answer,
                }))
              : [],
          }))
        : [];

      setQuestions(normalized);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerClick = (option) => {
    if (userAnswers[currentQuestionIndex]) return;
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: option,
    });
  };

  const handleNextClick = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      const selectedOption = userAnswers[index];
      if (selectedOption && selectedOption.isCorrect) {
        score++;
      }
    });
    return score;
  };

  const renderQuiz = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (
      !currentQuestion ||
      !Array.isArray(currentQuestion.options) ||
      !currentQuestion.question
    ) {
      return (
        <div className="text-center py-10">
          <p className="text-lg text-white">
            Unable to display question. Please try again.
          </p>
        </div>
      );
    }
    const userSelectedOption = userAnswers[currentQuestionIndex];
    const isAnswered = !!userSelectedOption;

    return (
      <div className="flex flex-col items-center w-full">
        <div className="w-full flex flex-col gap-2 mb-4">
          <div className="bg-[#6c6c6c] rounded py-2 px-4 text-white text-base font-bold text-center">
            QUESTION
          </div>
          <div className="text-white text-base font-semibold mb-2 text-center">
            {currentQuestion.question}
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                className={`rounded py-2 px-4 text-sm font-medium w-full text-left items-start justify-start flex transition-all
                  ${
                    isAnswered
                      ? option.isCorrect
                        ? "bg-green-700 text-white"
                        : userSelectedOption.text === option.text
                        ? "bg-red-700 text-white"
                        : "bg-[#6c6c6c] text-white"
                      : "bg-[#6c6c6c] text-white hover:bg-[#7c7c7c]"
                  }
                  ${!isAnswered ? "cursor-pointer" : "cursor-default"}
                `}
                onClick={() => handleAnswerClick(option)}
                disabled={isAnswered}
                style={{
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <span className="w-full text-left align-top">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleNextClick}
          className="bg-[#6c6c6c] text-white font-bold py-2 px-4 rounded mt-2 w-1/2 mx-auto text-sm"
          disabled={!isAnswered}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <h1 className="text-2xl font-bold text-white text-center mt-20 mb-2 tracking-wide">
        INTERVIEW PREPARATION
      </h1>
      <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-lg bg-[#4c4c4c] flex flex-col items-center mt-6">
        <div className="w-full flex flex-col items-center mb-4">

          <div className="flex flex-row gap-2 w-full justify-center mb-2">
            <input
              type="text"
              placeholder="Technology"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              className="bg-[#6c6c6c] text-white rounded py-2 px-4 w-1/2 focus:outline-none text-sm font-medium"
            />
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="bg-[#6c6c6c] text-white rounded py-2  w-1/2 focus:outline-none text-sm font-medium"
            >
              <option value="">Experience</option>
              <option value="0-3">0-3 yrs</option>
              <option value="3-6">3-6 yrs</option>
              <option value="6-9">6-9 yrs</option>
              <option value="10+">10+ yrs</option>
            </select>
            <button
              onClick={fetchQuestions}
              disabled={!technology || !experience || isLoading}
              className="bg-[#2563eb] hover:bg-blue-500 text-white font-bold py-2 px-4 rounded shadow text-sm disabled:bg-[#6c6c6c]"
            >
              {isLoading ? "Loading..." : "Go"}
            </button>
          </div>
        </div>
        {/* Loading Section */}
        {isLoading && (
          <div className="text-center py-6">
            <p className="text-base text-white">LOADING</p>
            <div className="mt-2 animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        {/* Quiz Section */}
        {!isLoading && questions.length > 0 && !showResults && (
          <div className="w-full flex flex-col items-center">
            {renderQuiz()}
          </div>
        )}
        {/* No Questions Section */}
        {!isLoading && questions.length === 0 && !showResults && (
          <div className="text-center py-6">
            <p className="text-base text-white">No questions available.</p>
          </div>
        )}
        {/* Results Section */}
        {showResults && (
          <div className="flex flex-col items-center w-full p-4 rounded">
            <h2 className="text-xl font-bold text-white mb-2">
              Quiz Complete!
            </h2>
            <p className="text-base font-semibold mb-4 text-white">
              Your Score:{" "}
              <span className="text-blue-400">{calculateScore()}</span> /{" "}
              {questions.length}
            </p>
            {/* Incorrect Questions Section */}
            {questions.filter((q, idx) => {
              const ans = userAnswers[idx];
              return ans && !ans.isCorrect;
            }).length > 0 && (
              <div className="w-full mb-4">
                <h3 className="text-base font-bold text-red-400 mb-1">
                  Questions you got wrong:
                </h3>
                <ul className="list-disc pl-4">
                  {questions.map((q, idx) => {
                    const ans = userAnswers[idx];
                    if (ans && !ans.isCorrect) {
                      return (
                        <li key={q.id} className="mb-2 text-white">
                          <div className="font-semibold text-sm">
                            {q.question}
                          </div>
                          <div className="text-xs">
                            Your answer:{" "}
                            <span className="text-red-400">{ans.text}</span>
                          </div>
                          <div className="text-xs">
                            Correct answer:{" "}
                            <span className="text-green-400">
                              {q.options.find((opt) => opt.isCorrect)?.text}
                            </span>
                          </div>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            )}
            <button
              className="bg-[#6c6c6c] text-white font-bold py-2 px-4 rounded mt-2 w-1/2 mx-auto text-sm"
              onClick={() => {
                setQuestions([]);
                setShowResults(false);
                setTechnology("");
                setExperience("");
              }}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
