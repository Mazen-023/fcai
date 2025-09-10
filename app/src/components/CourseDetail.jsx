
import { useEffect, useState } from "react";
import CourseEnrollments from "./CourseEnrollments";
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

export default function CourseDetail({ courseId }) {
  const [state, setState] = useState({
    course: null,
    loading: true,
  });

  const updateField = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  // Fetch course details with modules
  useEffect(() => {
    fetch(`http://localhost:8000/courses/courses/${courseId}/`)
      .then(res => res.json())
      .then(data => {
        updateField('course', data);
        updateField('loading', false);
      })
      .catch(error => {
        console.error('Error fetching course:', error);
        updateField('loading', false);
      });
  }, [courseId]);

  if (state.loading) return <div className="text-center py-4">Loading course...</div>;
  if (!state.course || state.course.error) return <div className="alert alert-danger">Course not found.</div>;

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
                <h2 className="fw-bold mb-2">{state.course.title}</h2>
                <p className="mb-1 text-muted">
                  <strong>University:</strong> {state.course.university}
                </p>
                <p className="mb-1 text-muted">
                  <strong>Duration:</strong> {state.course.duration}
                </p>
                <p className="mb-1 text-muted">
                  <strong>Instructor:</strong> {state.course.instructor_name}
                </p>
                <p className="mb-3">{state.course.description}</p>

                {/* Course Modules */}
                {state.course.modules && state.course.modules.length > 0 && (
                  <div className="mt-4">
                    <h4>Course Modules</h4>
                    <div className="row">
                      {state.course.modules.map(module => (
                        <div key={module.id} className="col-md-6 mb-3">
                          <Card>
                            <Card.Header>
                              <h6 className="mb-0">
                                Module {module.order}: {module.title}
                              </h6>
                            </Card.Header>
                            <Card.Body>
                              <p className="text-muted small mb-2">{module.description}</p>
                              {module.contents && module.contents.length > 0 && (
                                <div>
                                  <small className="text-muted">Contents:</small>
                                  <ul className="list-unstyled mt-1">
                                    {module.contents.map(content => (
                                      <li key={content.id} className="small">
                                        <Badge bg="secondary" className="me-1">{content.type}</Badge>
                                        {content.title}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <aside
                className="d-flex flex-column align-items-center bg-light rounded border pt-4 px-4 pb-4"
                style={{ minWidth: 260, maxWidth: 320 }}
              >
                <img
                  src={state.course.imgURL}
                  alt={state.course.title}
                  className="img-fluid rounded mb-3"
                  style={{ objectFit: 'cover', width: '100%', maxWidth: 220, maxHeight: 180 }}
                />
                <h5 className="mb-2">${state.course.price}</h5>
                <p className="mb-2">
                  <strong>Instructor:</strong> {state.course.instructor_name}
                </p>
                <CourseEnrollments
                  courseId={courseId}
                  render={({ isEnrolled, handleEnroll, enrollments }) => (
                    <div className="w-100">
                      <div className="mb-2 text-center">
                        <strong>Enrolled Students:</strong> {state.course.enrollment_count || enrollments.length}
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