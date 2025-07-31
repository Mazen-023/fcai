import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function Login() {
  // State to manage user login
  const [state, setState] = useState({
    username: '',
    password: '',
    error: '',
  });

  // Allow navigation via react router
  const navigate = useNavigate();

  // Access the AuthContext to set userId
  const { setUserId } = useContext(AuthContext);

  // Function to update username
  function updateUsername(event){
    setState({
      ...state,
      username: event.target.value,
    });
  }

  // Function to update password
  function updatePassword(event){
    setState({
      ...state,
      password: event.target.value,
    });
  }

  // Function to handle form submission
  const handleSubmit = (event) => {
      event.preventDefault();

      // Send data to server via Fetch API
      fetch('http://localhost:8000/accounts/login/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            { 
              username: state.username, 
              password: state.password 
            }),
      })
      .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        setUserId(data.id);
        localStorage.setItem('id', data['id']);
        navigate('/');
        console.log(data['message']);
      })
      .catch((error) => {
        setState({
          ...state,
          error: error.message,
        });
      });
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ minWidth: 350 }}>

        <h1 className='mb-4 text-center'>Login</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={state.username} onChange={updateUsername} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={state.password} onChange={updatePassword} />
          </Form.Group>

          {state.error && <p className="text-danger">{state.error}</p>}

          <Link to="/register" style={{ display: 'block', marginTop: '10px' }}>Don't have an account? Register here</Link>

          <Button variant="primary" type="submit" className="mt-3 w-100">
            Submit
          </Button>
        </Form>
        
      </div>
    </div>
  );
}

export default Login;
