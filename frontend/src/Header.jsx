import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";

function Header() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  return (
    <div className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-800">Task Manager</h2>

      <div className="flex gap-6 text-sm flex items-center">
        <span
          onClick={() => navigate("/")}
          className={`cursor-pointer ${
            location?.pathname === "/"
              ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          Task Listing
        </span>

        <span
          onClick={() => navigate("/add-task")}
          className={`cursor-pointer ${
            location?.pathname === "/add-task"
              ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          Add Task
        </span>
        <IoIosLogOut
          size={20}
          color="red"
          style={{ cursor: "pointer" }}
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[350px] p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
