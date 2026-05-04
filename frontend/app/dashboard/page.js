"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [taskInputs, setTaskInputs] = useState({});

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("ERROR:", data);
      return;
    }

    setProjects(data);
  };

  useEffect(() => { const load = async () => { await fetchProjects(); }; load(); }, []);

  //CREATE PROJECT
  const addProject = async () => {
    if (!newProject.trim()) return;

    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newProject,
      }),
    });

    setNewProject("");
    fetchProjects();
  };

  //CREATE TASK
  const addTask = async (projectId) => {
    const title = taskInputs[projectId];
    if (!title || !title.trim()) return;

    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        projectId,
      }),
    });

    setTaskInputs({ ...taskInputs, [projectId]: "" });
    fetchProjects();
  };

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProjects();
  };

  const toggleTask = async (taskId) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Task Manager
        </h1>

        {/* 🔥 ADD PROJECT */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-2">New Project</h2>
          <div className="flex gap-2">
            <input
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="Nama project..."
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              onClick={addProject}
              className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        {/* PROJECT LIST */}
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-md p-5 mb-5"
          >
            <h2 className="text-xl font-semibold mb-3">
              {p.name}
            </h2>

            {/* 🔥 INPUT TASK + BUTTON */}
            <div className="flex gap-2 mb-3">
              <input
                value={taskInputs[p.id] || ""}
                onChange={(e) =>
                  setTaskInputs({
                    ...taskInputs,
                    [p.id]: e.target.value,
                  })
                }
                placeholder="Tambah task..."
                className="flex-1 border px-3 py-2 rounded"
              />

              <button
                onClick={() => addTask(p.id)}
                className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>

            {/* TASK LIST */}
            {p.tasks.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Belum ada task
              </p>
            ) : (
              p.tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg mb-2"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={t.status === "done"}
                      onChange={() => toggleTask(t.id)}
                      className="mr-3"
                    />

                    <span
                      className={
                        t.status === "done"
                          ? "line-through text-gray-400"
                          : ""
                      }
                    >
                      {t.title}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTask(t.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}