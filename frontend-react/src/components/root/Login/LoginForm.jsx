import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../fragments/InputField/InputField"; // Import InputField
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const reqJson = {
      username: email,
      password: password,
    };

    fetch(`${import.meta.env.VITE_REACT_APP_BE_API_URL}/api/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqJson),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const decodedToken = jwtDecode(data.data);
          const role = decodedToken.role;

          localStorage.setItem("token", data.data);
          localStorage.setItem("userRole", role); // set userRole to check authenticate in App.jsx
          window.location.href = "/account";
        } else if (data.status === "ERROR") {
          toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
      })
      .catch((error) => {
        toast.error("Đã xảy ra lỗi khi đăng nhập.");
        console.error("Error:", error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      className="flex flex-col max-w-full mx-auto p-10 bg-[#FDF6E3] shadow-md rounded-md w-[450px] md:w-[500px]"
      onSubmit={handleSubmit}
    >
      <img
        loading="lazy"
        src="src/images/logo-page.avif"
        alt="Logo"
        className="object-contain self-center w-[90px] sm:w-[120px] mb-4"
      />
      <h2 className="self-center text-lg sm:text-xl text-[#5A4637] mb-4">
        Trang đăng nhập
      </h2>

      {/* Email InputField */}
      <InputField
        id="emailInput"
        name="email"
        type="text"
        placeholder="Tên tài khoản"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/0acec3f0c21c585b693aab238ddf1a6054cfa9ee7646ac7df643f1272897cf03?placeholderIfAbsent=true&apiKey=985f1fb8be044ffd914af5aef5360e96"
      />

      {/* Password InputField */}
      <InputField
        id="passwordInput"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Mật khẩu"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/26d9c5399a667e190537f967c908e5b53fea2716a5b94db02389112e242bc353?placeholderIfAbsent=true&apiKey=985f1fb8be044ffd914af5aef5360e96"
        showPasswordToggle
        showPassword={showPassword}
        onTogglePassword={togglePasswordVisibility}
      />

      <div className="flex flex-col mt-6 w-full">
        <div className="flex justify-end text-sm mb-4">
          <a href="/verifymail" className="text-[#B08B4F] font-bold">
            Quên mật khẩu?
          </a>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 text-sm sm:text-base text-white bg-[#B08B4F] rounded-md hover:bg-[#976C42] transition duration-300"
        >
          Đăng nhập
        </button>
        <div className="flex flex-wrap gap-2 mt-4 text-sm">
          <p className="text-[#5A4637]">Bạn chưa có tài khoản?</p>
          <a href="/register" className="text-[#B08B4F] font-bold underline">
            Tạo tài khoản
          </a>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
