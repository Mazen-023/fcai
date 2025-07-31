import { useState } from "react";

export default function CourseForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/courses/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
      credentials: "include"
    });
    if (res.ok) {
      setMsg("Course created!");
      setTitle("");
      setDescription("");
      if (onSuccess) onSuccess();
    } else {
      setMsg("Failed to create course.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Course</h2>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <button type="submit">Create</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}