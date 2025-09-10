import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [state, setState] = useState({
    assignment: null,
    loading: true,
    submitting: false,
    submitted: false,
    answers: {},
    result: null,
    error: '',
  });

  const updateField = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const updateAnswer = (questionId, value) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
  };

  useEffect(() => {
    fetch(`http://localhost:8000/projects/assignments/${assignmentId}/`)
      .then(res => res.json())
      .then(data => {
        updateField('assignment', data);
        updateField('loading', false);
      })
      .catch(error => {
        console.error('Error fetching assignment:', error);
        updateField('error', 'Failed to load assignment');
        updateField('loading', false);
      });
  }, [assignmentId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!userId) {
      updateField('error', 'Please log in to submit assignment');
      return;
    }

    const answersArray = Object.entries(state.answers).map(([questionId, answerText]) => ({
      question_id: parseInt(questionId),
      answer_text: answerText
    }));

    if (answersArray.length === 0) {
      updateField('error', 'Please answer at least one question');
      return;
    }

    updateField('submitting', true);
    updateField('error', '');

    fetch(`http://localhost:8000/projects/assignments/${assignmentId}/submit/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ answers: answersArray }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit assignment');
        return res.json();
      })
      .then(data => {
        updateField('result', data);
        updateField('submitted', true);
        updateField('submitting', false);
      })
      .catch(error => {
        updateField('error', error.message);
        updateField('submitting', false);
      });
  };

  if (state.loading) return <div className="text-center py-4">Loading assignment...</div>;
  if (!state.assignment) return <div className="alert alert-danger">Assignment not found.</div>;

  if (state.submitted && state.result) {
    return (
      <div className="container my-4">
        <Card>
          <Card.Header>
            <h3>Assignment Submitted!</h3>
          </Card.Header>
          <Card.Body>
            <Alert variant={state.result.passed ? 'success' : 'warning'}>
              <h5>Your Score: {state.result.grade.score.toFixed(1)}%</h5>
              <p>
                You answered {state.result.correct_answers} out of {state.result.total_questions} questions correctly.
              </p>
              <p>
                {state.result.passed 
                  ? '🎉 Congratulations! You passed this assignment.' 
                  : `You need ${state.assignment.min_pass_score}% to pass. You can try again later.`}
              </p>
            </Alert>
            <Button variant="primary" onClick={() => navigate('/assignments')}>
              Back to Assignments
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h3>{state.assignment.title}</h3>
            <Badge bg={state.assignment.is_required ? 'danger' : 'secondary'}>
              {state.assignment.is_required ? 'Required' : 'Optional'}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <p><strong>Course:</strong> {state.assignment.course_title}</p>
            <p><strong>Module:</strong> {state.assignment.module_title}</p>
            <p><strong>Minimum Pass Score:</strong> {state.assignment.min_pass_score}%</p>
          </div>

          {state.error && <Alert variant="danger">{state.error}</Alert>}

          {state.assignment.questions && state.assignment.questions.length > 0 ? (
            <Form onSubmit={handleSubmit}>
              <h4>Questions:</h4>
              {state.assignment.questions.map((question, index) => (
                <Card key={question.id} className="mb-3">
                  <Card.Body>
                    <h6>Question {index + 1}: {question.title}</h6>
                    
                    {question.answers && question.answers.length > 0 ? (
                      // Multiple choice question
                      <div>
                        {question.answers.map(answer => (
                          <Form.Check
                            key={answer.id}
                            type="radio"
                            name={`question_${question.id}`}
                            label={answer.correct_answer}
                            value={answer.correct_answer}
                            onChange={(e) => updateAnswer(question.id, e.target.value)}
                            checked={state.answers[question.id] === answer.correct_answer}
                          />
                        ))}
                      </div>
                    ) : (
                      // Text input question
                      <Form.Control
                        type="text"
                        placeholder="Enter your answer..."
                        value={state.answers[question.id] || ''}
                        onChange={(e) => updateAnswer(question.id, e.target.value)}
                      />
                    )}
                  </Card.Body>
                </Card>
              ))}
              
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={state.submitting}
                >
                  {state.submitting ? 'Submitting...' : 'Submit Assignment'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/assignments')}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <Alert variant="info">
              This assignment has no questions yet.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
