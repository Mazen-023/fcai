import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Dropdown from 'react-bootstrap/Dropdown';


function Layout() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(AuthContext);

  const handleLogout = () => {
    if (userId) {
      localStorage.removeItem('id');
      setUserId(null);
      navigate('/login');
    }
  };

  return (
    <>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/">Home</Link> |{" "}
          <Link to="/courses">Courses</Link> |{" "}
          <Link to="/assignments">Assignments</Link>
        </div>
        <div>
          {userId ? (
            <Dropdown align="end" style={{ display: 'inline-block' }}>
              <Dropdown.Toggle variant="link" id="dropdown-auth" style={{ textDecoration: 'none' }}>
                Account
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/courses/create">Create Course</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Link to="/login">Login</Link> |{" "}
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>

      <footer className="bg-light py-3 mt-5 border-top text-center">
        <p className="mb-0">&copy; 2025 FCAI-Learn</p>
      </footer>
    </>
  );
}

export default Layout;