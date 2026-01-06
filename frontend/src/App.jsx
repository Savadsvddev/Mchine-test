import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Pages/Register/Register";
import SIgnUp from "./Pages/Register/SIgnUp";
import Home from "./Pages/Task/Home";
import AddTask from "./Pages/Task/AddTask";
import TaskList from "./Pages/Task/TaskList";

function App() {

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/signup" element={<SIgnUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/task-list" element={<TaskList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
