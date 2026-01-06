import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { firestore } from "../../firebaseconfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/AxiosInstance";

function TaskList() {
  const db = firestore;
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("authToken");
  const [taskList, setTaskList] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:3000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`, // pass token in headers
        },
      });
      console.log("res", res);
      setTaskList(res.data?.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    try {
      const res = await axiosInstance.delete(
        "http://localhost:3000/delete-tasks",

        {
          headers: {
            Authorization: `Bearer ${token}`, // pass token in headers
          },
          data: { taskId },
        }
      );
      setTaskList((prev) => prev.filter((task) => task.id !== taskId));

      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  const handleEditTask = (item) => {
    navigate("/add-task", { state: { task: item } });
  };
  console.log("list", taskList);
  return (
    <div className="p-4">
      <div className="flex justify-evenly items-center px-[30px] py-[20px]">
        <div
          className={`cursor-pointer ${
            location?.pathname === "/task-list"
              ? "text-blue-600 underline"
              : "text-black"
          }`}
          onClick={() => navigate("/task-list")}
        >
          Task Listing
        </div>

        <div
          className={`cursor-pointer ${
            location?.pathname === "/add-task"
              ? "text-blue-600 underline"
              : "text-black"
          }`}
          onClick={() => navigate("/add-task")}
        >
          Add Task
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-100 p-2 text-left">
              SI No
            </th>
            <th className="border border-gray-300 bg-gray-100 p-2 text-left">
              Task
            </th>
            <th className="border border-gray-300 bg-gray-100 p-2 text-left">
              Amount
            </th>
            <th className="border border-gray-300 bg-gray-100 p-2 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {taskList.length === 0 && (
            <tr>
              <td
                colSpan="3"
                className="p-[10px] text-center border border-gray-300"
              >
                No tasks yet
              </td>
            </tr>
          )}

          {taskList.map((t, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{index + 1}</td>
              <td className="border border-gray-300 p-2">{t.TASK}</td>
              <td className="border border-gray-300 p-2">{t.AMOUNT}</td>
              <td className="border border-gray-300 p-2">
                <button
                  className="cursor-pointer bg-transparent border-none"
                  onClick={() => deleteTask(t?.id)}
                >
                  <FaTrash className="text-red-500" />
                </button>

                <button
                  className="ml-[5px] cursor-pointer bg-transparent border-none"
                  onClick={() => handleEditTask(t)}
                >
                  <FaEdit className="text-blue-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
