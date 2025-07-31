
import { useState } from "react";
import CourseBasicInfoForm from "../components/CourseBasicInfoForm";
import CourseModulesForm from "../components/CourseModulesForm";

export default function Create() {
  const [step, setStep] = useState(0);
  const [courseId, setCourseId] = useState(null);

  return (
    <div className="container mt-5">
      {step === 0 && (
        <CourseBasicInfoForm
          onSuccess={(data) => {
            setCourseId(data.id);
            setStep(1);
          }}
        />
      )}
      {step === 1 && courseId && (
        <CourseModulesForm courseId={courseId} onFinish={() => setStep(2)} />
      )}
      {step === 2 && (
        <div className="text-center mt-5">
          <h2>Course Created!</h2>
          <p>You have finished creating your course and modules.</p>
        </div>
      )}
    </div>
  );
}