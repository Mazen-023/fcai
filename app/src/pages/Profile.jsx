import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function Profile() {
  const { userId } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // Fetch user data from the API
    fetch(`http://localhost:8000/accounts/register/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(data => {
        // Find the current user in the users array
        const currentUser = data.users.find(user => user.id.toString() === userId.toString());
        if (currentUser) {
          setUserData(currentUser);
        } else {
          throw new Error('User not found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div className="text-center mt-5"><h2>Loading...</h2></div>;
  if (error) return <div className="text-center mt-5 text-danger"><h2>Error: {error}</h2></div>;
  if (!userData) return <div className="text-center mt-5"><h2>User not found</h2></div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title mb-4">Hello, {userData.username}!</h1>
          <div className="row">
            <div className="col-md-6">
              <h4>Your Profile Information</h4>
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;