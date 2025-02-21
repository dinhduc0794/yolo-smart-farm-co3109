import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Components
import HomePage from "../src/components/root/HomePage";
import React, {useEffect} from "react";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={1000} />
    </Router>
  );
}
