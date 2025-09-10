import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

function Profile() {
  const { userId } = useContext(AuthContext);
  const [state, setState] = useState({
    profile: null,
    loading: true,
    editing: false,
    error: '',
    success: '',
    formData: {
      first_name: '',
      last_name: '',
      email: '',
    }
  });

  const updateField = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const updateFormField = (field, value) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value }
    }));
  };

  useEffect(() => {
    if (userId) {
      fetch('http://localhost:8000/accounts/profile/', {
        credentials: 'include',
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch profile');
          return res.json();
        })
        .then(data => {
          setState(prev => ({
            ...prev,
            profile: data,
            loading: false,
            formData: {
              first_name: data.first_name || '',
              last_name: data.last_name || '',
              email: data.email || '',
            }
          }));
        })
        .catch(error => {
          updateField('error', error.message);
          updateField('loading', false);
        });
    }
  }, [userId]);

  const handleEdit = () => {
    updateField('editing', true);
    updateField('error', '');
    updateField('success', '');
  };

  const handleCancel = () => {
    updateField('editing', false);
    setState(prev => ({
      ...prev,
      formData: {
        first_name: prev.profile?.first_name || '',
        last_name: prev.profile?.last_name || '',
        email: prev.profile?.email || '',
      }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    fetch('http://localhost:8000/accounts/profile/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(state.formData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update profile');
        return res.json();
      })
      .then(data => {
        setState(prev => ({
          ...prev,
          profile: data,
          editing: false,
          success: 'Profile updated successfully!',
          error: ''
        }));
      })
      .catch(error => {
        updateField('error', error.message);
        updateField('success', '');
      });
  };

  if (state.loading) return <div className="text-center">Loading profile...</div>;
  if (!state.profile) return <div className="alert alert-danger">Profile not found</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card>
            <Card.Header>
              <h3>User Profile</h3>
            </Card.Header>
            <Card.Body>
              {state.error && <Alert variant="danger">{state.error}</Alert>}
              {state.success && <Alert variant="success">{state.success}</Alert>}
              
              {!state.editing ? (
                <div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Username:</strong></div>
                    <div className="col-sm-9">{state.profile.username}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Email:</strong></div>
                    <div className="col-sm-9">{state.profile.email}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>First Name:</strong></div>
                    <div className="col-sm-9">{state.profile.first_name || 'Not set'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Last Name:</strong></div>
                    <div className="col-sm-9">{state.profile.last_name || 'Not set'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Role:</strong></div>
                    <div className="col-sm-9">
                      <span className={`badge ${state.profile.role === 'teacher' ? 'bg-primary' : 'bg-success'}`}>
                        {state.profile.role}
                      </span>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Member Since:</strong></div>
                    <div className="col-sm-9">{new Date(state.profile.date_joined).toLocaleDateString()}</div>
                  </div>
                  <Button variant="primary" onClick={handleEdit}>Edit Profile</Button>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={state.formData.email}
                      onChange={(e) => updateFormField('email', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={state.formData.first_name}
                      onChange={(e) => updateFormField('first_name', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={state.formData.last_name}
                      onChange={(e) => updateFormField('last_name', e.target.value)}
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit">Save Changes</Button>
                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
