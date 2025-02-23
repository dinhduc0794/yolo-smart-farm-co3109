import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import InputField from "../fragments/InputField/InputField";
import { toast } from "react-toastify";

function RegisForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Xác nhận mật khẩu không trùng khớp");
      return;
    }
    navigate("/verify");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex bg-white shadow-md rounded-lg overflow-hidden w-[800px]">
        {/* Cột 1: Hình ảnh / Logo */}
        <div className="w-1/3 bg-[#B08B4F] flex items-center justify-center p-6">
          <img
            src="src/images/logo-page.avif"
            alt="Logo"
            className="object-contain w-[150px] sm:w-[180px]"
          />
        </div>

        {/* Cột 2: Form đăng ký */}
        <form className="w-2/3 p-6 flex flex-col" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <IoMdArrowRoundBack size={20} color="#B08B4F" />
              <a href="/login" className="ml-2 text-[#B08B4F] hover:underline text-lg font-bold">
                Trở về
              </a>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-[#5A4637]">Đăng ký</span>
              <p className="text-sm text-[#A68A64]">Bước 1/2</p>
            </div>
          </div>

          <h2 className="text-center text-xl font-semibold text-[#5A4637] mb-4">
            Tạo tài khoản
          </h2>

          <InputField
            id="emailInput"
            name="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            id="passwordInput"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <InputField
            id="confirmPasswordInput"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <button
            type="submit"
            className="w-full mt-4 px-4 py-3 text-white bg-[#B08B4F] rounded-md hover:bg-[#976C42] transition duration-300 text-lg"
          >
            Tiếp tục
          </button>

          <p className="text-center mt-4 text-sm text-[#5A4637]">
            Bạn đã có tài khoản?{" "}
            <a href="/login" className="text-[#B08B4F] font-bold underline">
              Đăng nhập
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisForm;
