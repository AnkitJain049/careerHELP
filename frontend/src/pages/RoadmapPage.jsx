import React from "react";
import Navbar from "../components/Navbar";

const RoadmapPage = () => {
  return (
    <div className="min-h-screen mt-20 font-sans">
      <Navbar />
      <div className="w-full max-w-2xl mx-auto p-12 rounded-2xl shadow-lg bg-[#4c4c4c] flex flex-col items-center mt-8">
        <h1 className="text-2xl font-bold text-white text-center mb-4 tracking-wide">Roadmaps</h1>
        <p className="text-white text-lg text-center mt-8">Coming soon...</p>
      </div>
    </div>
  );
};

export default RoadmapPage;
