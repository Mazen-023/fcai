import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function CourseEnrollments({ courseId, render }) {
  const { userId } = useContext(AuthContext);
  const [state, setState] = useState({
    enrollments: [],
    loading: true,
    isEnrolled: false,
    showModal: false,
    enrolling: false,
    error: null,
  });

  // Helper to update any field in state
  const updateField = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };


  // Fetch enrollments and update state
  const fetchEnrollments = () => {
    fetch(`http://localhost:8000/courses/enrollments/`)
      .then(res => res.json())
      .then(data => {
        const filtered = (data.enrollments || []).filter(e => e.course === Number(courseId));
        const enrolled = filtered.some(e => String(e.student) === String(userId));
        setState(prev => ({
          ...prev,
          enrollments: filtered,
          isEnrolled: enrolled,
          loading: false,
        }));
      });
  };

  useEffect(() => {
    fetchEnrollments();
  }, [courseId, userId]);

  const handleEnroll = () => {
    updateField('showModal', true);
  };

  const handleSubmit = (event) => {
    event && event.preventDefault();
    updateField('enrolling', true);
    updateField('error', null);
    fetch('http://localhost:8000/courses/enrollments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ course: courseId, student: userId }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Enrollment failed');
        }
        return response.json();
      })
      .then(() => {
        updateField('isEnrolled', true);
        updateField('showModal', false);
        fetchEnrollments();
      })
      .catch((error) => {
        updateField('error', error.message);
      })
      .finally(() => {
        updateField('enrolling', false);
      });
  };

  if (state.loading) return <div>Loading enrollments...</div>;

  const modal = state.showModal && (
    <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Enrollment</h5>
            <button type="button" className="btn-close" onClick={() => updateField('showModal', false)}></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to enroll in this course?</p>
            {state.error && <div className="alert alert-danger">{state.error}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => updateField('showModal', false)} disabled={state.enrolling}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={state.enrolling}>
              {state.enrolling ? 'Enrolling...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (render) {
    return <>
      {modal}
      {render({ isEnrolled: state.isEnrolled, handleEnroll, enrollments: state.enrollments })}
    </>;
  }

  return (
    <>
      {modal}
      <h4>Enrolled Students: {state.enrollments.length}</h4>
      <button
        className="btn btn-primary mt-2"
        onClick={handleEnroll}
        disabled={state.isEnrolled}
      >
        {state.isEnrolled ? 'Enrolled' : 'Enroll Now'}
      </button>
    </>
  );
}