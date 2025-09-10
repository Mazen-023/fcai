import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { apiService } from '../services/api';
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
  const handleSubmit = async (event) => {
      event.preventDefault();

      try {
        const data = await apiService.login(state.username, state.password);
        
        setUserId(data.id);
        localStorage.setItem('id', data.id);
        navigate('/');
        console.log(data.message);
      } catch (error) {
        setState({
          ...state,
          error: error.message,
        });
      }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ minWidth: 350 }}>

        <h1 className='mb-4 text-center'>Login</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={state.username} onChange={updateField('username')} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={state.password} onChange={updateField('password')} />
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