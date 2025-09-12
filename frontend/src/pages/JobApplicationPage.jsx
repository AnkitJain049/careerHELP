import React, { useEffect, useState } from "react";
import JobRow from "../components/JobRow";

import Navbar from "../components/Navbar";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const JobApplicationPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    status: "",
    notes: "",
  });

  // Handler: Show add form
  const handleShowAddForm = () => {
    setShowAddForm(true);
    setNewJob({ title: "", company: "", status: "", notes: "" });
  };

  // Handler: Hide add form
  const handleHideAddForm = () => {
    setShowAddForm(false);
    setNewJob({ title: "", company: "", status: "", notes: "" });
  };

  // Handler: Change new job input
  const handleNewJobChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  // Handler: Submit new job
  const handleAddJob = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/job-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newJob, userId }),
      });
      if (!res.ok) throw new Error("Failed to add job");
      const job = await res.json();
      setJobs((jobs) => [...jobs, job]);
      handleHideAddForm();
    } catch (err) {
      setError("Failed to add job.");
    } finally {
      setIsLoading(false);
    }
  };
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingJob, setEditingJob] = useState(null); // {jobId, field, value}
  const [openNotesId, setOpenNotesId] = useState(null);

  // Handler: Start editing a cell
  const handleCellDoubleClick = (jobId, field, value) => {
    setEditingJob({ jobId, field, value });
  };

  // Handler: Change value in input
  const handleCellChange = (e) => {
    setEditingJob(editingJob ? { ...editingJob, value: e.target.value } : null);
  };

  // Handler: Save changes (on blur or enter)
  const handleCellBlurOrEnter = async () => {
    if (!editingJob) return;
    setIsLoading(true);
    setError("");
    try {
      const { jobId, field, value } = editingJob;
      const res = await fetch(`${API_BASE}/api/job-application/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value, userId }),
      });
      if (!res.ok) throw new Error("Failed to update job");
      // Update jobs state
      setJobs((jobs) =>
        jobs.map((job) =>
          job._id === jobId ? { ...job, [field]: value } : job
        )
      );
      setEditingJob(null);
      setOpenNotesId(null);
    } catch (err) {
      setError("Failed to update job.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Delete job
  const handleDelete = async (jobId) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/job-application/${jobId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to delete job");
      setJobs((jobs) => jobs.filter((job) => job._id !== jobId));
    } catch (err) {
      setError("Failed to delete job.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get userId from localStorage (user object)
  let userId = "";
  try {
    const userObj = JSON.parse(localStorage.getItem("user"));
    userId = userObj?.id;
  } catch {
    userId = "";
  }

  // Fetch jobs for user
  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    fetch(`${API_BASE}/api/job-application/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch jobs.");
        setIsLoading(false);
      });
  }, [userId]);

  return (
  <div className="min-h-screen  font-sans relative">
      <Navbar />
        <h1 className="text-2xl font-bold text-white text-center mt-20 mb-2 tracking-wide">
          JOB APPLICATION TRACKER
        </h1>
        <div className="w-full max-w-6xl mx-auto p-8 rounded-2xl shadow-lg bg-[#4c4c4c] flex flex-col items-center mt-6">
        <div className="w-full flex justify-end mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold shadow hover:bg-blue-700 transition"
            onClick={handleShowAddForm}
          >
            + Add
          </button>
        </div>
        {/* Floating Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <form
              className="w-full max-w-lg mx-auto bg-[#232323] p-8 rounded-lg shadow flex flex-col gap-4 relative"
              onSubmit={handleAddJob}
            >
              <button
                type="button"
                className="absolute top-2 right-2 text-white text-xl"
                onClick={handleHideAddForm}
                title="Close"
              >
                ×
              </button>
              <div className="flex gap-4">
                <input
                  type="text"
                  name="title"
                  value={newJob.title}
                  onChange={handleNewJobChange}
                  placeholder="Title"
                  className="w-1/2 px-3 py-2 rounded bg-[#4c4c4c] text-white border border-[#6c6c6c] focus:outline-none"
                  required
                />
                <input
                  type="text"
                  name="company"
                  value={newJob.company}
                  onChange={handleNewJobChange}
                  placeholder="Company"
                  className="w-1/2 px-3 py-2 rounded bg-[#4c4c4c] text-white border border-[#6c6c6c] focus:outline-none"
                  required
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  name="status"
                  value={newJob.status}
                  onChange={handleNewJobChange}
                  placeholder="Status"
                  className="w-1/2 px-3 py-2 rounded bg-[#4c4c4c] text-white border border-[#6c6c6c] focus:outline-none"
                  required
                />
                <input
                  type="text"
                  name="notes"
                  value={newJob.notes}
                  onChange={handleNewJobChange}
                  placeholder="Notes"
                  className="w-1/2 px-3 py-2 rounded bg-[#4c4c4c] text-white border border-[#6c6c6c] focus:outline-none"
                />
              </div>
              <div className="flex gap-4 justify-end mt-2">
                <button
                  type="button"
                  className="bg-gray-600 text-white px-4 py-2 rounded text-sm"
                  onClick={handleHideAddForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold shadow hover:bg-blue-700 transition"
                >
                  Add Job
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Inline editing, no form above */}
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        <div className="w-full">
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-base text-white">LOADING...</p>
              <div className="mt-2 animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <table
              className="w-full text-white text-sm table-fixed"
              style={{ tableLayout: "fixed" }}
            >
              <thead>
                <tr className="bg-[#232323]">
                  <th
                    className="py-2 px-4 text-center"
                    style={{ width: "12%" }}
                  >
                    Date
                  </th>
                  <th
                    className="py-2 px-4 text-center"
                    style={{ width: "22%" }}
                  >
                    Title
                  </th>
                  <th
                    className="py-2 px-4 text-center"
                    style={{ width: "22%" }}
                  >
                    Company
                  </th>
                  <th
                    className="py-2 px-4 text-center"
                    style={{ width: "14%" }}
                  >
                    Status
                  </th>
                  <th
                    className="py-2 px-4 text-center"
                    style={{ width: "14%" }}
                  >
                    Notes
                  </th>
                  <th className="py-2 px-4 text-center" style={{ width: "8%" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <JobRow
                    key={job._id}
                    job={job}
                    editingJob={editingJob}
                    openNotesId={openNotesId}
                    handleCellDoubleClick={handleCellDoubleClick}
                    handleCellChange={handleCellChange}
                    handleCellBlurOrEnter={handleCellBlurOrEnter}
                    setOpenNotesId={setOpenNotesId}
                    setEditingJob={setEditingJob}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;
