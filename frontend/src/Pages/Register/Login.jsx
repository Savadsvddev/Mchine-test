import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

function Login() {
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
        toast.error(data.message || "Login failed");
      } else {
        localStorage.setItem("authToken", data?.token);

        // console.log("dataaa", data);

        toast.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="bg-white w-[90%] sm:w-[380px] rounded-xl shadow-xl p-6">
        <h3 className="text-center font-semibold text-blue-600 text-lg mb-5">
          Login
        </h3>

        <div className="flex flex-col gap-4">
          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Enter Number"
              type="text"
              className="px-3 py-2 rounded-md outline-none border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setPhone(value);
                }
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="text-gray-600 text-sm mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="px-3 py-2 rounded-md outline-none border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500 hover:text-blue-500 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>

          {/* Button */}
          <button
            className="w-full bg-blue-500 h-10 text-white rounded-md font-medium hover:bg-blue-600 transition flex items-center justify-center"
            onClick={handleLogin}
          >
            {loading ? <ClipLoader color="white" size={20} /> : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
