import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function CourseEnrollments({ courseId, render }) {
  const { userId } = useContext(AuthContext);
  const [state, setState] = useState({
    enrollments: [],
    loading: true,
    isEnrolled: false,
    userEnrollmentId: null,
    showModal: false,
    modalAction: 'enroll', // 'enroll' or 'unenroll'
    processing: false,
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
        const userEnrollment = filtered.find(e => String(e.student) === String(userId));
        const enrolled = !!userEnrollment;
        
        setState(prev => ({
          ...prev,
          enrollments: filtered,
          isEnrolled: enrolled,
          userEnrollmentId: enrolled ? userEnrollment.id : null,
          loading: false,
        }));
      });
  };

  useEffect(() => {
    fetchEnrollments();
  }, [courseId, userId]);

  const handleEnrollAction = () => {
    if (state.isEnrolled) {
      // Prepare to unenroll
      updateField('showModal', true);
      updateField('modalAction', 'unenroll');
    } else {
      // Prepare to enroll
      updateField('showModal', true);
      updateField('modalAction', 'enroll');
    }
  };

  const handleSubmit = (event) => {
    event && event.preventDefault();
    updateField('processing', true);
    updateField('error', null);
    
    if (state.modalAction === 'enroll') {
      // Enroll the student
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
        .then((data) => {
          updateField('isEnrolled', true);
          updateField('userEnrollmentId', data.id);
          updateField('showModal', false);
          fetchEnrollments();
        })
        .catch((error) => {
          updateField('error', error.message);
        })
        .finally(() => {
          updateField('processing', false);
        });
    } else {
      // Unenroll the student
      fetch(`http://localhost:8000/courses/enrollments/${state.userEnrollmentId}/`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Unenrollment failed');
          }
          updateField('isEnrolled', false);
          updateField('userEnrollmentId', null);
          updateField('showModal', false);
          fetchEnrollments();
        })
        .catch((error) => {
          updateField('error', error.message);
        })
        .finally(() => {
          updateField('processing', false);
        });
    }
  };

  if (state.loading) return <div>Loading enrollments...</div>;

  const modal = state.showModal && (
    <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {state.modalAction === 'enroll' ? 'Confirm Enrollment' : 'Confirm Unenrollment'}
            </h5>
            <button type="button" className="btn-close" onClick={() => updateField('showModal', false)}></button>
          </div>
          <div className="modal-body">
            <p>
              {state.modalAction === 'enroll' 
                ? 'Are you sure you want to enroll in this course?' 
                : 'Are you sure you want to unenroll from this course?'}
            </p>
            {state.error && <div className="alert alert-danger">{state.error}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => updateField('showModal', false)} disabled={state.processing}>
              Cancel
            </button>
            <button 
              type="button" 
              className={`btn ${state.modalAction === 'enroll' ? 'btn-primary' : 'btn-danger'}`} 
              onClick={handleSubmit} 
              disabled={state.processing}
            >
              {state.processing 
                ? (state.modalAction === 'enroll' ? 'Enrolling...' : 'Unenrolling...') 
                : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (render) {
    return <>
      {modal}
      {render({ 
        isEnrolled: state.isEnrolled, 
        handleEnroll: handleEnrollAction, 
        enrollments: state.enrollments 
      })}
    </>;
  }

  return (
    <>
      {modal}
      <h4>Enrolled Students: {state.enrollments.length}</h4>
      <button
        className={`btn ${state.isEnrolled ? 'btn-outline-danger' : 'btn-primary'} mt-2`}
        onClick={handleEnrollAction}
      >
        {state.isEnrolled ? 'Unenroll' : 'Enroll Now'}
      </button>
    </>
  );
}