import { useEffect, useState } from "react";

export default function CourseModules({ courseId }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/courses/modules/`)
      .then(res => res.json())
      .then(data => {
        // Filter modules by courseId
        setModules((data.modules || []).filter(m => m.course === Number(courseId)));
        setLoading(false);
      });
  }, [courseId]);

  if (loading) return <div>Loading modules...</div>;
  if (!modules.length) return <div>No modules for this course.</div>;

return (
    <div className="card my-3" style={{ maxWidth: "400px" }}>
        <div className="card-header">
            <h4 className="mb-0">
                Modules <span className="badge bg-secondary">{modules.length}</span>
            </h4>
        </div>
        <ul className="list-group list-group-flush">
            {modules.map(m => (
                <li key={m.id} className="list-group-item">
                    Week {m.order}: {m.title}
                </li>
            ))}
        </ul>
    </div>
);
}