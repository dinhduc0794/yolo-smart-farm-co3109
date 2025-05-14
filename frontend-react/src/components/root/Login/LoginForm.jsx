import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn, clearAuthError } from "../../../store/AuthSlice";
import InputField from "../fragments/InputField/InputField";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Clear any previous auth errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearAuthError());
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(signIn({ email, password }));
    if (!result.error) {
      navigate("/account");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md md:max-w-3xl">
        {/* Logo/Image Section - Full width on mobile, 1/3 width on desktop */}
        <div className="w-full md:w-1/3 bg-[#B08B4F] flex items-center justify-center p-6">
          <img
            src="src/images/logo-page.avif"
            alt="Logo"
            className="object-contain w-[150px] sm:w-[400px]"
          />
        </div>

        {/* Form Section - Full width on mobile, 2/3 width on desktop */}
        <form className="w-full md:w-2/3 p-6 flex flex-col" onSubmit={handleSubmit}>
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

          {error && (
            <div className="text-red-500 text-sm mt-2 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-4 py-2 text-white bg-[#B08B4F] rounded-md hover:bg-[#976C42] transition duration-300 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
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