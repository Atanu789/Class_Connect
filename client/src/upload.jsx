import { useState } from "react";
import axios from "axios";
import Input from "./components/Input";
import Button from "./components/Button";
import { useNavigate } from "react-router-dom";
import './upload.css';

export default function Component() {
  const navigate = useNavigate();

  const [studentFullname, setStudentFullname] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentUsername, setStudentUsername] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentInst, setStudentInst] = useState("");
  const [studentImg, setStudentImg] = useState(null);
  const [studentError, setStudentError] = useState("");

  const handleFileChange = (e) => {
    setStudentImg(e.target.files[0]);
  };

 const createStudent = async (event) => {
  event.preventDefault();
  setStudentError("");
  try {
    const formData = new FormData();
    formData.append("fullName", studentFullname);
    formData.append("email", studentEmail);
    formData.append("studentId", studentId);
    formData.append("username", studentUsername);
    formData.append("password", studentPassword);
    formData.append("instituteName", studentInst);
    formData.append("studentAvatar", studentImg);

    const response = await axios.post(
      `http://localhost:8000/api/v1/students/register`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const { studentAvatar } = response.data; // Assuming the response contains the student's avatar URL
    localStorage.setItem("studentId", JSON.stringify(studentId));
    localStorage.setItem("studentName", JSON.stringify(studentFullname));
    localStorage.setItem("studentEmail", JSON.stringify(studentEmail));
    localStorage.setItem("studentUsername", JSON.stringify(studentUsername));
    localStorage.setItem("studentAvatar", JSON.stringify(studentAvatar)); // Store the avatar URL

    navigate('/Stud');
    console.log("Student registration successful", response.data);
  } catch (error) {
    console.error("Student registration error: ", error);
    setStudentError("Failed to register student. Please try again.");
  }
};


  return (
    <div className="min-h-screen py-1 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#313131] shadow-lg rounded-lg p-6 mt-16">
          <h2 className="text-2xl font-bold text-center mb-4">Student Sign Up</h2>
          {studentError && <p className="text-red-500 text-center">{studentError}</p>}
          <form onSubmit={createStudent} className="space-y-4">
            <Input
              label="Name"
              id="student-name"
              placeholder="Enter your name"
              value={studentFullname}
              onChange={(e) => setStudentFullname(e.target.value)}
              required
            />
            <Input
              label="Email"
              id="student-email"
              placeholder="Enter your email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
              type="email"
            />
            <Input
              label="Enrollment-Id"
              id="student-id"
              placeholder="Enter your Enrollment ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
            <Input
              label="UserName"
              placeholder="Enter your Unique UserName"
              value={studentUsername}
              onChange={(e) => setStudentUsername(e.target.value)}
              required
            />
            <Input
              label="Password"
              placeholder="Create a Strong Password"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              required
              type="password"
            />
            <Input
              label="Institute Name"
              placeholder="Enter your Institute's Name"
              value={studentInst}
              onChange={(e) => setStudentInst(e.target.value)}
              required
            />
            <Input
              type="file"
              label="Select Your Profile Picture"
              onChange={handleFileChange}
              required
            />
    
            <div className="flex justify-center">
              <Button type="submit" info="students" className="btn-dark">Create Account</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
