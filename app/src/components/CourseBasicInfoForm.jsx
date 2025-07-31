import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function CourseBasicInfoForm({ onSuccess }) {
  const [state, setState] = useState({
    title: '',
    description: '',
    imgUrl: '',
    price: '',
    duration: '',
    error: '',
    success: '',
  });

  function updateField(field) {
    return (event) => {
      setState({
        ...state,
        [field]: event.target.value,
      });
    };
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:8000/courses/courses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: state.title,
        description: state.description,
        imgUrl: state.imgUrl,
        price: state.price,
        duration: state.duration,
      }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to create course');
      }
      return res.json();
    })
    .then((data) => {
      setState({
        ...state,
        title: '',
        description: '',
        imgUrl: '',
        price: '',
        duration: '',
        error: '',
        success: 'Course created successfully!',
      });
      if (onSuccess) onSuccess(data);
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
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" placeholder="Title" value={state.title} onChange={updateField('title')} required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" placeholder="Description" value={state.description} onChange={updateField('description')} required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="imgUrl">
        <Form.Label>Image URL</Form.Label>
        <Form.Control type="url" placeholder="Image URL" value={state.imgUrl} onChange={updateField('imgUrl')} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" min="0" step="0.01" placeholder="Price" value={state.price} onChange={updateField('price')} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="duration">
        <Form.Label>Duration</Form.Label>
        <Form.Control type="text" placeholder="Duration" value={state.duration} onChange={updateField('duration')} />
      </Form.Group>
      {state.error && <div className="text-danger mb-2">{state.error}</div>}
      {state.success && <div className="text-success mb-2">{state.success}</div>}
      <Button variant="primary" type="submit" className="w-100">Next</Button>
    </Form>
  );
}
