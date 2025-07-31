import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CourseList() {
  const [state, setState] = useState({
    courses: [],
    loading: true,
  });

  const updateField = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetch("http://localhost:8000/courses/courses")
      .then(res => res.json())
      .then(data => {
        updateField('courses', data.courses || []);
        updateField('loading', false);
      });
  }, []);

  if (state.loading) return <div>Loading courses...</div>;
  if (!state.courses.length) return <div>No courses found.</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">Courses</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {state.courses.map(course => (
          <div className="col" key={course.id}>
            <div className="card h-100 shadow-sm">
              <img src={course.imgURL} alt={course.title} className="card-img-top" style={{ objectFit: 'cover', height: '180px' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                <Link to={`/courses/${course.id}`} className="stretched-link text-decoration-none text-dark">
                    {course.title}
                </Link>
                </h5>
                <p className="card-text mb-1"><strong>University:</strong> {course.university}</p>
                <p className="card-text text-muted">{course.description?.slice(0, 80)}{course.description && course.description.length > 80 ? '...' : ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}