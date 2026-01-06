import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { firestore } from "../../firebaseconfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/AxiosInstance";
import Header from "../../Header";
import ClipLoader from "react-spinners/ClipLoader";

function TaskList() {
  const db = firestore;
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("authToken");
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/tasks");
      console.log("res", res);
      setTaskList(res.data?.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    try {
      const res = await axiosInstance.delete(
        "/delete-tasks",

        {
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
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Content */}
      <div className="px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">
                  #
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">
                  Task
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-6">
                    <div className="flex justify-center">
                      <ClipLoader size={30} />
                    </div>
                  </td>
                </tr>
              ) : taskList.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-sm text-gray-500"
                  >
                    No tasks available. Click “Add Task” to create one.
                  </td>
                </tr>
              ) : (
                taskList.map((t, index) => (
                  <tr
                    key={t.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-800">
                      {t.TASK}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      ₹ {t.AMOUNT}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditTask(t)}
                          className="p-2 rounded-full bg-blue-50 hover:bg-blue-100"
                        >
                          <FaEdit className="text-blue-600 text-sm" />
                        </button>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="p-2 rounded-full bg-red-50 hover:bg-red-100"
                        >
                          <FaTrash className="text-red-600 text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
