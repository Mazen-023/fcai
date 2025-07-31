import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";


function Home() {
  const { userId } = useContext(AuthContext);

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section className="py-5 text-center text-white" style={{ background: 'linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)' }}>
        <div className="container">
          <h1 className="fw-bold display-4 mb-3">Welcome to FCAI-Learn</h1>
          <p className="lead mb-4">Your journey to knowledge starts here.</p>
          <img
            src="https://t4.ftcdn.net/jpg/13/08/47/35/360_F_1308473502_vbHEKx5Tf0pbqHFVllifF5NuaUQ8i945.jpg"
            alt="Educational"
            className="img-fluid rounded shadow-lg"
            style={{ maxWidth: '400px' }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="bg-light rounded p-4 shadow-sm h-100">
                <h3>Expert Instructors</h3>
                <p>Learn from experienced teachers and industry professionals.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="bg-light rounded p-4 shadow-sm h-100">
                <h3>Interactive Courses</h3>
                <p>Engage with hands-on content and real-world projects.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="bg-light rounded p-4 shadow-sm h-100">
                <h3>Flexible Learning</h3>
                <p>Study at your own pace, anytime and anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-5 text-center text-white" style={{ background: '#4e54c8' }}>
        <div className="container">
          <h2 className="fw-semibold mb-3">Ready to start learning?</h2>
          <p className="lead mb-4">Join FCAI-Learn today and unlock your potential!</p>
          { userId ? (
            <a href="/profile" className="btn btn-light btn-lg fw-semibold rounded-pill px-5 py-3">
              Go to Profile
            </a>
          ) : (
            <a href="/login" className="btn btn-light btn-lg fw-semibold rounded-pill px-5 py-3">
              Get Started
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
