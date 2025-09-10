import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './pages/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Details from './pages/Details';
import Create from './pages/Create';
import Assignments from './pages/Assignments';
import AssignmentDetailPage from './pages/AssignmentDetailPage';
import NotFound from './pages/NotFound';

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem('id'));

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="courses/:courseId" element={<Details />} />
              <Route path="courses/create" element={<Create />} />
              <Route path="assignments/:assignmentId" element={<AssignmentDetailPage />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
