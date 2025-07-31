

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function CourseEnrollments({ courseId, render }) {
  const { userId } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/courses/enrollments/`)
      .then(res => res.json())
      .then(data => {
        const filtered = (data.enrollments || []).filter(e => e.course === Number(courseId));
        setEnrollments(filtered);
        const enrolled = filtered.some(e => String(e.student) === String(userId));
        setIsEnrolled(enrolled);
        setLoading(false);
      });
  }, [courseId, userId]);

  const handleEnroll = () => {
    setShowModal(true);
  };

  // Helper to get cookie value by name
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleSubmit = (event) => {
    event && event.preventDefault();
    setEnrolling(true);
    setError(null);
    fetch('http://localhost:8000/courses/enrollments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include',
      body: JSON.stringify({ course: courseId }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Enrollment failed');
        }
        return response.json();
      })
      .then(() => {
        setIsEnrolled(true);
        setShowModal(false);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setEnrolling(false);
      });
  };

  if (loading) return <div>Loading enrollments...</div>;

  const modal = showModal && (
    <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Enrollment</h5>
            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to enroll in this course?</p>
            {error && <div className="alert alert-danger">{error}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={enrolling}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={enrolling}>
              {enrolling ? 'Enrolling...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (render) {
    return <>
      {modal}
      {render({ isEnrolled, handleEnroll, enrollments })}
    </>;
  }

  return (
    <>
      {modal}
      <h4>Enrolled Students: {enrollments.length}</h4>
      <button
        className="btn btn-primary mt-2"
        onClick={handleEnroll}
        disabled={isEnrolled}
      >
        {isEnrolled ? 'Enrolled' : 'Enroll Now'}
      </button>
      {isEnrolled && <div className="alert alert-success mt-2">You are enrolled in this course.</div>}
    </>
  );
}