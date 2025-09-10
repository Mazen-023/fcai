import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function CourseModulesForm({ courseId, onFinish }) {
  const [state, setState] = useState({
    name: '',
    description: '',
    error: '',
    success: '',
  });
  const [modules, setModules] = useState([]);

  function updateField(field) {
    return (event) => {
      setState({
        ...state,
        [field]: event.target.value,
      });
    };
  }

  const handleAddModule = (event) => {
    event.preventDefault();
    setState({ ...state, error: '', success: '' });
    fetch(`http://localhost:8000/courses/${courseId}/modules/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: state.name,
        description: state.description,
      }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to add module');
      }
      return res.json();
    })
    .then((data) => {
      setModules([...modules, data]);
      setState({
        ...state,
        name: '',
        description: '',
        error: '',
        success: 'Module added!',
      });
    })
    .catch((error) => {
      setState({
        ...state,
        error: error.message,
        success: '',
      });
    });
  };

  return (
    <div>
      <h3>Add Modules</h3>
      <Form onSubmit={handleAddModule}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Module Name</Form.Label>
          <Form.Control type="text" placeholder="Module Name" value={state.name} onChange={updateField('name')} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" placeholder="Description" value={state.description} onChange={updateField('description')} required />
        </Form.Group>
        {state.error && <div className="text-danger mb-2">{state.error}</div>}
        {state.success && <div className="text-success mb-2">{state.success}</div>}
        <Button variant="secondary" type="submit">Add Module</Button>
      </Form>
      <ul className="mt-3">
        {modules.map((mod, idx) => (
          <li key={mod.id || idx}><b>{mod.name}</b>: {mod.description}</li>
        ))}
      </ul>
      <Button variant="primary" className="mt-4" onClick={onFinish}>Finish</Button>
    </div>
  );
}
