import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Components
import NotFoundPage from "../src/components/root/404NotFoundPage";
import HomePage from "../src/components/root/HomePage";
import LoginPage from "../src/components/root/LoginPage";
import RegisterPage from "../src/components/root/RegisterPage";
import Verification from "./components/root/Verify/Verification";
import InputMail from "./components/root/Verify/InputMail";
import CreateNewPassword from "./components/root/CreateNewPassword";
import AccountInformation from "../src/components/root/AccountInformation";
import ChangePassword from "./components/root/ChangePassword";
import ManageFarm from "./components/root/ManageFarm";
import ManageLight from "./components/root/ManageLight";
import ManageWater from "./components/root/ManageWater";
import Summary from "./components/root/Summary";
import FarmLog from "./components/root/FarmLog";
import React, { useEffect } from "react";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/notfound" element={<NotFoundPage />} />
        <Route path="/verifymail" element={<InputMail />} />
        <Route
          path="/verify-newpass"
          element={<Verification isNewPass={true} />}
        />
        <Route path="/newpassword" element={<CreateNewPassword />} />

        <Route path="/account" element={<AccountInformation />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/setting" element={<ManageFarm />} />
        <Route path="/lighting" element={<ManageLight />} />
        <Route path="/watering" element={<ManageWater />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/log-farm" element={<FarmLog />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={1000} />
    </Router>
  );
}
