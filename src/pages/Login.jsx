import { useState } from "react";
import User from "/src/assets/authriz-assets/User.png";
import Lock from "/src/assets/authriz-assets/Lock.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // To store error messages

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post("http://localhost:4000/api/users/login", {
        email,
        password,
      });
      
      const { token,userId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId",userId);
      console.log(response.data);
      

     navigate("/task");
    } catch (err) {
      setError("Invalid credentials or server error");
      console.error(err);
    }
  };

  return (
    <div className="bg-[#E9EFF2] flex items-center justify-center font-anek h-screen">
      <div className="bg-white flex items-center justify-center flex-col w-[80%] h-[80%] py-40 rounded-xl">
        <h1 className="font-medium text-[35px] text-[#1D4DAF]">Login</h1>
        <p className="font-medium text-[19px] text-gray-500 p-2">
          Hey enter your details to sign your Account
        </p>
        <form className="w-100 gap-5 flex flex-col mt-10" onSubmit={handleLogin}>
          <div className="flex items-center justify-items-start border-1 border-gray-300 rounded-md w-full gap-2 p-2">
            <img src={User} alt="User" />
            <input
              type="email"
              placeholder="Enter your username or email"
              className="flex-1 text-[17px] font-medium focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-items-start border-1 border-gray-300 rounded-md w-full gap-2 p-2">
            <img src={Lock} alt="Lock" />
            <input
              type="password"
              placeholder="Enter your password"
              className="flex-1 text-[17px] font-medium focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="text-[22px] font-semibold bg-[#4B2FC8] text-white p-1 rounded-md cursor-pointer pt-2"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-2">{error}</p>
        )}

        <div className="flex gap-2 mt-10">
          <p className="text-[16px] font-medium text-gray-500">
            Don’t have an Account ?
          </p>
          <a
            className="text-[#4B2FC8] text-[16px] font-semibold cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Signup now
          </a>
        </div>
      </div>
    </div>
  );
};
