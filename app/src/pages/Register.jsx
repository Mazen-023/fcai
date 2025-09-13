import {useState, useContext} from 'react'
import {Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Register() {

  // State to manage user regisration 
  const [state, setState] = useState({
    username: '',
    email: '',
    password: '',
    confirmation: '',
    role: '',
    error: '',
  });

  // Allow navigation via react router
  const navigate = useNavigate();

  // Access the AuthContext to set userId
  const { setUserId } = useContext(AuthContext);

  // Function to update fields
  function updateField(field) {
    return (event) => {
      setState({
        ...state,
        [field]: event.target.value,
      });
    };
  }

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Send data to server via Fetch API
    fetch('http://localhost:8000/accounts/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: state.username,
        email: state.email,
        password: state.password,
        confirmation: state.confirmation,
        role: state.role
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    })
    .then(data => {
      setUserId(data.id);
      localStorage.setItem('id', data.id);
      navigate('/');
    })
    .catch(error => {
      console.log(error);
      setState({
        ...state,
        error: error.message
      });
    });
  }

  return(
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div style={{ minWidth: 350 }}>

        <h1 className='text-center mb-5'>Register</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={state.username} onChange={updateField('username')} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter Email" value={state.email} onChange={updateField('email')} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={state.password} onChange={updateField('password')} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmation">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="confirmation" value={state.confirmation} onChange={updateField('confirmation')} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Select value={state.role} onChange={updateField('role')}>
              <option value="" disabled>Select Role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </Form.Select>
          </Form.Group>

          {state.error && <p className="text-danger">{state.error}</p>}

          <Link to="/login" style={{ display: 'block', marginTop: '10px' }}>Already have an account? login</Link>

          <Button variant="primary" type="submit" className="mt-3 w-100">
            Submit
          </Button>
        </Form>

      </div>
    </div>
  )
}

export default Register;
