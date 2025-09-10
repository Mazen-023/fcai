import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

export default function AssignmentList() {
  const [state, setState] = useState({
    assignments: [],
    loading: true,
  });

  const updateField = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetch('http://localhost:8000/projects/assignments/')
      .then(res => res.json())
      .then(data => {
        updateField('assignments', data.assignments || []);
        updateField('loading', false);
      })
      .catch(error => {
        console.error('Error fetching assignments:', error);
        updateField('loading', false);
      });
  }, []);

  if (state.loading) return <div className="text-center">Loading assignments...</div>;
  if (!state.assignments.length) return <div className="alert alert-info">No assignments available.</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">Assignments</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {state.assignments.map(assignment => (
          <div className="col" key={assignment.id}>
            <Card className="h-100 shadow-sm">
              <Card.Header>
                <h6 className="mb-0">
                  <Link 
                    to={`/assignments/${assignment.id}`} 
                    className="text-decoration-none"
                  >
                    {assignment.title}
                  </Link>
                </h6>
              </Card.Header>
              <Card.Body>
                <p className="card-text">
                  <strong>Course:</strong> {assignment.course_title}
                </p>
                <p className="card-text">
                  <strong>Module:</strong> {assignment.module_title}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <Badge bg={assignment.is_required ? 'danger' : 'secondary'}>
                    {assignment.is_required ? 'Required' : 'Optional'}
                  </Badge>
                  <small className="text-muted">
                    Pass Score: {assignment.min_pass_score}%
                  </small>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
