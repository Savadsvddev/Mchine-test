import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../firebaseconfig";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const db = firestore;

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!name || !number || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
    setLoading(true);
    try {
      const userId = Date.now().toString();
      await setDoc(doc(db, "USER", userId), {
        ID: userId,
        NAME: name,
        NUMBER: number,
        PASSWORD: password,
      });

      toast.success("User created successfully");

      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create user.");
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
    <div className="bg-white w-[90%] sm:w-[420px] rounded-xl shadow-xl p-6">
      <h3 className="text-center font-semibold text-blue-600 text-lg mb-5">
        Register
      </h3>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Enter Name"
            type="text"
            className="px-3 py-2 rounded-md outline-none border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Number */}
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">
            Number <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Enter Number"
            type="text"
            className="px-3 py-2 rounded-md outline-none border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            value={number}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value.length <= 10) {
                setNumber(value);
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

        {/* Confirm Password */}
        <div className="flex flex-col relative">
          <label className="text-gray-600 text-sm mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            className="px-3 py-2 rounded-md outline-none border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500 hover:text-blue-500 transition"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>

        {/* Button */}
        <button
          className="w-full bg-blue-500 h-10 text-white rounded-md font-medium hover:bg-blue-600 transition flex items-center justify-center"
          onClick={handleSignup}
        >
          {loading ? <ClipLoader color="white" size={20} /> : "Register"}
        </button>
      </div>
    </div>
  </div>
  );
}

export default Register;
