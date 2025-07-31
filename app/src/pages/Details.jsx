import { useParams } from "react-router-dom";

import CourseDetail from "../components/CourseDetail";
import CourseModules from "../components/CourseModules";

export default function Details() {
  const { courseId } = useParams();

  return (
    <div className="container-fluid my-5">
      <div className="row g-4">
        <div className="col-12">
          <CourseDetail courseId={courseId} onlyMainInfo />
        </div>
        <div className="col-12">
          <CourseModules courseId={courseId} />
        </div>
      </div>
    </div>
  );
}