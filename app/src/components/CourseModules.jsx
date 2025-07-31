import { useEffect, useState } from "react";

export default function CourseModules({ courseId }) {
  const [state, setState] = useState({
    modules: [],
    loading: true,
  });

  const updateField = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetch(`http://localhost:8000/courses/modules/`)
      .then(res => res.json())
      .then(data => {
        updateField('modules', (data.modules || []).filter(m => m.course === Number(courseId)));
        updateField('loading', false);
      });
  }, [courseId]);

  if (state.loading) return <div>Loading modules...</div>;
  if (!state.modules.length) return <div>No modules for this course.</div>;

  return (
    <div className="card my-3" style={{ maxWidth: "400px" }}>
      <div className="card-header">
        <h4 className="mb-0">
          Modules <span className="badge bg-secondary">{state.modules.length}</span>
        </h4>
      </div>
      <ul className="list-group list-group-flush">
        {state.modules.map(module => (
          <li key={module.id} className="list-group-item">
            Week {module.order}: {module.title}
          </li>
        ))}
      </ul>
    </div>
  );
}