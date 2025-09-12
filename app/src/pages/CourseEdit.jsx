import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import ModuleManager from "../components/ModuleManager";

function CourseEdit() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imgURL: '',
    price: '',
    university: '',
    duration: '',
  });

  useEffect(() => {
    // Fetch the course data
    fetch(`http://localhost:8000/courses/courses/${courseId}/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch course");
        return res.json();
      })
      .then(data => {
        setCourse(data);
        
        // Check if user is the instructor of this course
        const instructorId = typeof data.instructor === 'object' 
          ? data.instructor.id 
          : data.instructor;
          
        if (instructorId.toString() !== userId?.toString()) {
          setError("You don't have permission to edit this course");
        } else {
          // Populate form with course data
          setFormData({
            title: data.title || '',
            description: data.description || '',
            imgURL: data.imgURL || '',
            price: data.price || '',
            university: data.university || '',
            duration: data.duration || '',
          });
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [courseId, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    fetch(`http://localhost:8000/courses/courses/${courseId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        instructor: userId
      }),
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update course');
      return res.json();
    })
    .then(data => {
      setSuccess('Course updated successfully!');
      setCourse(data);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/courses/${courseId}`);
      }, 1500);
    })
    .catch(err => {
      setError(err.message);
    });
  };

  if (loading) return <div className="text-center py-5"><h3>Loading...</h3></div>;
  if (error && !course) return <div className="text-center py-5 text-danger"><h3>Error: {error}</h3></div>;
  if (!course) return <div className="text-center py-5"><h3>Course not found</h3></div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Edit Course: {course.title}</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <Tab.Container id="course-edit-tabs" defaultActiveKey="basic-info">
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="basic-info">Basic Information</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="modules">Manage Modules</Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Tab.Content>
              <Tab.Pane eventKey="basic-info">
                <div className="pt-3">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control 
                        type="url" 
                        name="imgURL"
                        value={formData.imgURL}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>University</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label>Price</Form.Label>
                          <Form.Control 
                            type="number"
                            min="0"
                            step="0.01"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </div>
                      
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label>Duration</Form.Label>
                          <Form.Control 
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="secondary" onClick={() => navigate(-1)}>
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                </div>
              </Tab.Pane>
              
              <Tab.Pane eventKey="modules">
                <div className="pt-3">
                  <ModuleManager courseId={courseId} />
                  
                  <div className="mt-4">
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                      Back to Course
                    </Button>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
}

export default CourseEdit;