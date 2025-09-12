import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

export default function ModuleManager({ courseId }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [editingModule, setEditingModule] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch modules for this course
  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    fetch(`http://localhost:8000/courses/modules/`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch modules');
        return res.json();
      })
      .then((data) => {
        // Filter and sort modules for this course
        const courseModules = data.modules
          .filter((mod) => mod.course.toString() === courseId.toString())
          .sort((a, b) => a.order - b.order);
        
        setModules(courseModules);
        setLoading(false);
      })
      .catch((error) => {
        setMessage({ type: 'danger', text: `Error loading modules: ${error.message}` });
        setLoading(false);
      });
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setEditingModule(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (editingModule) {
      // Update existing module
      fetch(`http://localhost:8000/courses/modules/${editingModule.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          course: courseId,
          order: editingModule.order,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to update module');
          return res.json();
        })
        .then((data) => {
          // Replace the updated module in the modules array
          const updatedModules = modules.map((mod) =>
            mod.id === editingModule.id ? data : mod
          );
          setModules(updatedModules);
          setMessage({ type: 'success', text: 'Module updated successfully!' });
          resetForm();
        })
        .catch((error) => {
          setMessage({ type: 'danger', text: error.message });
        });
    } else {
      // Create new module
      fetch(`http://localhost:8000/courses/modules/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          course: courseId,
          order: modules.length, // Set order to be the next available position
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to create module');
          return res.json();
        })
        .then((data) => {
          setModules([...modules, data]);
          setMessage({ type: 'success', text: 'Module added successfully!' });
          resetForm();
        })
        .catch((error) => {
          setMessage({ type: 'danger', text: error.message });
        });
    }
  };

  const handleEdit = (module) => {
    setFormData({
      title: module.title,
      description: module.description,
    });
    setEditingModule(module);
  };

  const handleDelete = (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      fetch(`http://localhost:8000/courses/modules/${moduleId}/`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to delete module');
          
          // Remove the module from the list and update order of remaining modules
          const remainingModules = modules.filter((mod) => mod.id !== moduleId);
          setModules(remainingModules);
          setMessage({ type: 'success', text: 'Module deleted successfully!' });
        })
        .catch((error) => {
          setMessage({ type: 'danger', text: error.message });
        });
    }
  };

  if (loading) {
    return <div className="text-center my-4">Loading modules...</div>;
  }

  return (
    <div className="module-manager">
      <h4 className="mb-4">{editingModule ? 'Edit Module' : 'Add New Module'}</h4>
      
      {message.text && (
        <div className={`alert alert-${message.type} mb-3`}>{message.text}</div>
      )}
      
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Module Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter module title"
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter module description"
            rows={3}
            required
          />
        </Form.Group>
        
        <div className="d-flex gap-2">
          <Button variant="primary" type="submit">
            {editingModule ? 'Update Module' : 'Add Module'}
          </Button>
          {editingModule && (
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </Form>

      <h4 className="mt-4 mb-3">Course Modules</h4>
      {modules.length === 0 ? (
        <p className="text-muted">No modules have been added to this course yet.</p>
      ) : (
        <ListGroup>
          {modules.map((module) => (
            <ListGroup.Item key={module.id} className="d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Module {module.order + 1}: {module.title}</div>
                <p className="mb-1">{module.description}</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={() => handleEdit(module)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => handleDelete(module.id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}