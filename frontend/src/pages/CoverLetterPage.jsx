/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "../components/Navbar";

const CoverLetterPage = () => {
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const handleGenerate = async () => {
    setIsLoading(true);
    setCoverLetter("");
    setError("");
    let userId = "";
    try {
      const userObj = JSON.parse(localStorage.getItem("user"));
      userId = userObj?.id;
    } catch {
      userId = "";
    }
    if (!userId) {
      setError("User not logged in.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/cover-letter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          position,
          company,
          skills,
        }),
      });
      const data = await response.json();
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter);
      } else {
        setError(data.error || "Failed to generate cover letter.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  font-sans">
      <Navbar />
      <h1 className="text-2xl font-bold text-white text-center mt-20 mb-2 tracking-wide">
        COVER LETTER GENERATOR
      </h1>
      <div className="w-full max-w-4xl mt-6 mx-auto  p-12 rounded-2xl shadow-lg bg-[#4c4c4c] flex flex-col items-center">
        <div className="w-full flex flex-col gap-4 mb-3">
          <div className="flex flex-row gap-4 w-full">
            <input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="bg-[#6c6c6c] text-white rounded py-2 px-4 w-full focus:outline-none text-sm font-medium"
            />
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-[#6c6c6c] text-white rounded py-2 px-4 w-full focus:outline-none text-sm font-medium"
            />
          </div>
          <input
            type="text"
            placeholder="Relevant Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="bg-[#6c6c6c] text-white rounded py-2 px-4 w-full focus:outline-none text-sm font-medium"
          />
          <button
            onClick={handleGenerate}
            disabled={!position || !company || !skills || isLoading}
            className="bg-[#252525] hover:bg-[#3c3c3c] text-white font-bold py-2 px-4 rounded shadow text-sm disabled:bg-[#6c6c6c]"
          >
            {isLoading ? "LOADING..." : "Generate Cover Letter"}
          </button>
        </div>
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        {coverLetter && (
          <div
            className="w-full bg-[#232323] rounded p-4 text-white text-sm whitespace-pre-line"
            style={{ minHeight: "200px" }}
          >
            {coverLetter}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterPage;
