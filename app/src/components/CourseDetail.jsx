import { useEffect, useState } from "react";
import CourseEnrollments from "./CourseEnrollments";

export default function CourseDetail({ courseId }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [instructorName, setInstructorName] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/courses/courses/${courseId}/`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        setLoading(false);
        // Fetch instructor username if needed
        if (data && data.instructor && typeof data.instructor === 'number') {
            fetch(`http://localhost:8000/accounts/register/`)
            .then(res => res.json())
            .then(users => {
              const instructor = users.find(u => u.id === data.instructor);
              setInstructorName(instructor ? instructor.username : data.instructor);
            })
            .catch(() => setInstructorName(data.instructor));
        } else if (data && data.instructor && data.instructor.username) {
          setInstructorName(data.instructor.username);
        }
      });
  }, [courseId]);

  if (loading) return <div className="text-center py-4">Loading course...</div>;
  if (!course || course.error) return <div className="alert alert-danger">Course not found.</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 mx-auto">
          <div className="mb-2">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4">

              <section
                className="flex-fill bg-white rounded border p-4"
                style={{ minWidth: 0 }}
              >
                <h2 className="fw-bold mb-2">{course.title}</h2>
                <p className="mb-1 text-muted">
                  <strong>University:</strong> {course.university}
                </p>
                <p className="mb-1 text-muted">
                  <strong>Duration:</strong> {course.duration}
                </p>
                <p className="mb-3">{course.description}</p>
              </section>

              <aside
                className="d-flex flex-column align-items-center bg-light rounded border pt-4 px-4 pb-4"
                style={{ minWidth: 260, maxWidth: 320 }}
              >
                <img
                  src={course.imgURL}
                  alt={course.title}
                  className="img-fluid rounded mb-3"
                  style={{ objectFit: 'cover', width: '100%', maxWidth: 220, maxHeight: 180 }}
                />
                <h5 className="mb-2">${course.price}</h5>
                <p className="mb-2">
                  <strong>Instructor:</strong> {instructorName || course.instructor}
                </p>
                <CourseEnrollments
                  courseId={courseId}
                  render={({ isEnrolled, handleEnroll, enrollments }) => (
                    <div className="w-100">
                      <div className="mb-2 text-center">
                        <strong>Enrolled Students:</strong> {enrollments.length}
                      </div>
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleEnroll}
                        disabled={isEnrolled}
                      >
                        {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                      </button>
                    </div>
                  )}
                />
              </aside>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}