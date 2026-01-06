import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

function SIgnUp() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT for CORS
        body: JSON.stringify({
          number: phone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Sign Up failed");
      } else {
        localStorage.setItem("authToken", (data?.token));

        // console.log("dataaa", data);

        toast.success("Sign Up successful!");
        navigate("/home");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" h-screen flex items-center justify-center">
      <div className="bg-white w-1/4 h-50 p-3 shadow-lg">
        <h3 className="text-center font-bold text-blue-600 text-base">
          SignUp
        </h3>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col items-start">
            <label className="text-center text-gray-600 text-sm">
              Number <span style={{ color: "red" }}>*</span>
            </label>
            <input
              placeholder="Enter Number"
              type="text"
              className="pl-2.5 w-full rounded outline-none border-[1px] border-solid border-gray-400 text-md focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits and max length 10
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setPhone(value);
                }
              }}
            />
          </div>
          <div className="flex flex-col items-start relative">
            <label className="text-center text-gray-600 text-sm">
              Password <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="pl-2.5 w-full rounded outline-none border-[1px] border-solid border-gray-400 text-md focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>
          <button
            className="w-full bg-blue-500 h-7 text-white rounded cursor-pointer  hover:bg-blue-600 "
            onClick={handleLogin}
          >
            {loading ? <ClipLoader color="white" size={20} /> : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SIgnUp;
