import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { firestore } from "../../firebaseconfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";
import axiosInstance from "../../utils/AxiosInstance";

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
        const res = await axiosInstance.put(
          "http://localhost:3000/update-task",
          { taskId, task, amount: Number(amount) },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = res.data;
        toast.success("Task updated successfully!", data);
        navigate("/task-list");
      } catch (error) {
        toast.error("Error updating task", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const res = await axiosInstance.post(
          "http://localhost:3000/add-task",
          { task, amount: Number(amount) },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;

        console.log("Task added:", data);
        toast.success("Task added successfully");
        console.log("added");
        navigate("/task-list");
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
    if (state?.task?.TASK ) {
      setTask(state.task.TASK);
    }
    if (state?.task?.AMOUNT ) {
      setAmount(state.task.AMOUNT);
    }
  }, [state]);
  console.log("state", state);
  return (
    <div>
      {/* Header */}
      <div className="flex gap-6 p-4">
        <div
          className={`cursor-pointer ${
            location.pathname === "/task-list"
              ? "font-bold text-blue-600 underline"
              : "text-gray-500"
          }`}
          onClick={() => navigate("/task-list")}
        >
          Task Listing
        </div>

        <div
          className={`cursor-pointer ${
            location.pathname === "/add-task"
              ? "font-bold text-blue-600 underline"
              : "text-gray-500"
          }`}
          onClick={() => navigate("/add-task")}
        >
          Add Task
        </div>
      </div>

      {/* Input + Button */}
      <div className="flex justify-center items-center mt-6">
        <input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-[200px] h-[30px] border border-black bg-white text-black pl-[10px] rounded outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
        />

        <input
          placeholder="Enter Amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-[30px] border border-black bg-white text-black pl-[10px] rounded outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ml-4"
        />

        <button
          className="ml-3 w-15 h-[30px] px-[5px] bg-blue-600 text-white text-sm flex items-center justify-center cursor-pointer"
          onClick={addTask}
        >
          {state?.task ? (
            loading ? (
              <ClipLoader size={20} color="white" />
            ) : (
              "Update"
            )
          ) : loading ? (
            <ClipLoader size={20} color="white" />
          ) : (
            "Add"
          )}
        </button>
      </div>
    </div>
  );
}

export default AddTask;
