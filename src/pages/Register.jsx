import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import User from "/src/assets/authriz-assets/User.png";
import Lock from "/src/assets/authriz-assets/Lock.png";

export const Register = () => {
  const navigate = useNavigate();

  // Local state to capture input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Simple validation check for password matching
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/users/register", {
        email,
        password,
        // Optionally, add a role or let the backend set a default value
      });

      if (response.status === 201) {
        setSuccess("Registration successful. Redirecting to login...");
        // Optionally, wait for a moment before navigating
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#E9EFF2] flex items-center justify-center font-anek h-screen">
      <div className="bg-white flex items-center justify-center flex-col w-[80%] h-[80%] py-32 rounded-xl">
        <h1 className="font-medium text-[35px] text-[#1D4DAF]">Sign Up</h1>
        <p className="font-medium text-[19px] text-gray-500 p-2">
          Hey, enter your details to sign up for an account
        </p>
        <form className="w-100 gap-5 flex flex-col mt-10" onSubmit={handleRegister}>
          <div className="flex items-center border border-gray-300 rounded-md w-full gap-2 p-2">
            <img src={User} alt="User" className="w-6 h-6" />
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 text-[17px] font-medium focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md w-full gap-2 p-2">
            <img src={Lock} alt="Lock" className="w-6 h-6" />
            <input
              type="password"
              placeholder="Enter your password"
              className="flex-1 text-[17px] font-medium focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md w-full gap-2 p-2">
            <img src={Lock} alt="Lock" className="w-6 h-6" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="flex-1 text-[17px] font-medium focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <button
            type="submit"
            className="text-[22px] font-semibold bg-[#4B2FC8] text-white p-2 rounded-md cursor-pointer"
          >
            Sign Up
          </button>
        </form>
        <div className="flex gap-2 mt-10">
          <p className="text-[16px] font-medium text-gray-500">
            Already have an account?
          </p>
          <a
            className="text-[#4B2FC8] text-[16px] font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign In now
          </a>
        </div>
      </div>
    </div>
  );
};
