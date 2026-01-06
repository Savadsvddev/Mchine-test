import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleAddTask = () => {
    navigate("/add-task");
  };
  
    const handlelistTask = () => {
    navigate("/task-list");
  };
  return (
    <div className="flex items-center w-full h-screen justify-center  gap-20">
      <div>
        <button className="w-40 bg-yellow-400 p-2 cursor-pointer rounded hover:bg-yellow-600 hover:text-white" onClick={handleAddTask}>
          Add task{" "}
        </button>
      </div>
      <div>
        <button className="w-40 bg-yellow-400 p-2 cursor-pointer rounded hover:bg-yellow-600 hover:text-white"onClick={handlelistTask}>
          Task List{" "}
        </button>
      </div>
    </div>
  );
}
