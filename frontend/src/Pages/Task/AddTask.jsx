import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { firestore } from "../../firebaseconfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";
import axiosInstance from "../../utils/AxiosInstance";
import Header from "../../Header";

function AddTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const db = firestore;
  const token = localStorage.getItem("authToken");

  const [task, setTask] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const addTask = async () => {
    if (state?.task) {
      setLoading(true);
      try {
        const taskId = state?.task?.id;
        const res = await axiosInstance.put("/update-task", {
          taskId,
          task,
          amount: Number(amount),
        });
        const data = res.data;
        toast.success("Task updated successfully!", data);
        navigate("/");
      } catch (error) {
        toast.error("Error updating task", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const res = await axiosInstance.post("/add-task", {
          task,
          amount: Number(amount),
        });

        const data = res.data;

        console.log("Task added:", data);
        toast.success("Task added successfully");
        console.log("added");
        navigate("/");
      } catch (error) {
        console.log("faileddd", error);
        toast.error("Error adding task");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Safely check if state exists
    if (state?.task?.TASK) {
      setTask(state.task.TASK);
    }
    if (state?.task?.AMOUNT) {
      setAmount(state.task.AMOUNT);
    }
  }, [state]);
  console.log("state", state);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <Header />

      {/* Content */}
      <div className="px-8 py-10">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {state?.task ? "Edit Task Details" : "Create a New Task"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Task Name
              </label>
              <input
                type="text"
                placeholder="e.g. Grocery Shopping"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="text"
                placeholder="e.g. 1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={addTask}
              className="px-6 h-10 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center"
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : state?.task ? (
                "Update Task"
              ) : (
                "Add Task"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTask;
