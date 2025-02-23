import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../fragments/InputField/InputField";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    window.location.href = "/account";

    // event.preventDefault();
    // const reqJson = { username: email, password: password };

    // fetch(`${import.meta.env.VITE_REACT_APP_BE_API_URL}/api/authenticate`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(reqJson),
    //   credentials: "include",
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.status === "OK") {
    //       const decodedToken = jwtDecode(data.data);
    //       const role = decodedToken.role;
    //       localStorage.setItem("token", data.data);
    //       localStorage.setItem("userRole", role);
    //       window.location.href = "/account";
    //     } else {
    //       toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    //     }
    //   })
    //   .catch(() => toast.error("Đã xảy ra lỗi khi đăng nhập."));
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

        {/* Cột 2: Form Đăng nhập */}
        <form className="w-2/3 p-6 flex flex-col" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-[#5A4637] mb-4 text-center">
            Đăng nhập
          </h2>

          <InputField
            id="emailInput"
            name="email"
            type="text"
            placeholder="Tên tài khoản"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/0acec3f0c21c585b693aab238ddf1a6054cfa9ee7646ac7df643f1272897cf03"
          />

          <InputField
            id="passwordInput"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/26d9c5399a667e190537f967c908e5b53fea2716a5b94db02389112e242bc353"
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <div className="flex justify-end text-sm mt-2">
            <a href="/verifymail" className="text-[#B08B4F] font-bold">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 text-white bg-[#B08B4F] rounded-md hover:bg-[#976C42] transition duration-300"
          >
            Đăng nhập
          </button>

          <div className="flex justify-center mt-4 text-sm">
            <p className="text-[#5A4637]">Bạn chưa có tài khoản?</p>
            <a href="/register" className="text-[#B08B4F] font-bold ml-1">
              Đăng ký
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
