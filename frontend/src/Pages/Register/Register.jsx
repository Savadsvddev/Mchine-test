import React, { useState } from "react";
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

      navigate("/signup");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" h-screen flex items-center justify-center">
      <div className="bg-white w-1/4 h-75 p-3 shadow-lg">
        <h3 className="text-center font-bold text-blue-600 text-base">
          Register
        </h3>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col items-start">
            <label className="text-center text-gray-600 text-sm">
              Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              placeholder="Enter Name"
              type="text"
              className="pl-2.5 w-full rounded outline-none border-[1px] border-solid border-gray-400 text-md focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-center text-gray-600 text-sm">
              Number <span style={{ color: "red" }}>*</span>
            </label>
            <input
              placeholder="Enter Number"
              type="text"
              className="pl-2.5 w-full rounded outline-none border-[1px] border-solid border-gray-400 text-md focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              value={number}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits and max length 10
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setNumber(value);
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
          <div className="flex flex-col items-start relative">
            <label className="text-center text-gray-600 text-sm">
              Confirm Password <span style={{ color: "red" }}>*</span>
            </label>
            <input
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              className="pl-2.5 w-full rounded outline-none border-[1px] border-solid border-gray-400 text-md focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>
          <button
            className="w-full bg-blue-500 h-7 text-white rounded cursor-pointer  hover:bg-blue-600 "
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
