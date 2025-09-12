import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function InstructorCourses() {
  const { userId } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // Fetch all courses
    fetch('http://localhost:8000/courses/courses/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        return response.json();
      })
      .then(data => {
        // Filter courses to only show those taught by the current instructor
        const instructorCourses = data.courses.filter(course => 
          course.instructor.toString() === userId.toString() || 
          (typeof course.instructor === 'object' && course.instructor.id.toString() === userId.toString())
        );
        setCourses(instructorCourses);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div className="text-center mt-3"><p>Loading courses...</p></div>;
  if (error) return <div className="text-center mt-3 text-danger"><p>Error: {error}</p></div>;
  if (courses.length === 0) return <div className="text-center mt-3"><p>You don't have any courses yet.</p></div>;

  return (
    <div className="mt-4">
      <h4 className="mb-3">Your Courses</h4>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {courses.map(course => (
          <div key={course.id} className="col">
            <div className="card h-100">
              {course.imgURL && (
                <img 
                  src={course.imgURL} 
                  className="card-img-top" 
                  alt={course.title} 
                  style={{ height: '160px', objectFit: 'cover' }} 
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text text-truncate">{course.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <Link to={`/courses/${course.id}`} className="btn btn-sm btn-outline-primary">
                    View Course
                  </Link>
                  <Link to={`/courses/${course.id}/edit`} className="btn btn-sm btn-outline-secondary">
                    Edit Course
                  </Link>
                </div>
              </div>
              <div className="card-footer text-muted">
                <small>{course.university} · {course.duration}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorCourses;