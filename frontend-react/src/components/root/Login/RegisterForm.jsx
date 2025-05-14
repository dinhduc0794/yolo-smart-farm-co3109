import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import InputField from "../fragments/InputField/InputField";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../../store/AuthSlice";

function RegisForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneno: ""
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không trùng khớp";
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }
    
    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneno) {
      newErrors.phoneno = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(formData.phoneno)) {
      newErrors.phoneno = "Số điện thoại không hợp lệ (phải có 10 số)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    
    if (!validateForm()) {
      setTimeout(() => console.log("Updated errors after validation:", errors), 0);
      return;
    }
    
    try {
      const result = await dispatch(signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        phoneno: formData.phoneno
      }));
      
      if (result.error) {
        console.error("Registration failed:", result.error);
        toast.error(`Đăng ký không thành công: ${result.error.message || "Vui lòng thử lại"}`);
        return;
      }
      
      toast.success("Đăng ký tài khoản thành công");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(`Lỗi: ${error.message || "Đã xảy ra lỗi không xác định"}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
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
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <IoMdArrowRoundBack size={20} color="#B08B4F" />
              <a href="/login" className="ml-2 text-[#B08B4F] hover:underline text-lg font-bold">
                Trở về
              </a>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-[#5A4637]">Đăng ký</span>
            </div>
          </div>

          <h2 className="text-center text-xl font-semibold text-[#5A4637] mb-4">
            Tạo tài khoản
          </h2>

          {/* Full name field */}
          <InputField
            id="nameInput"
            name="name"
            type="text"
            placeholder="Họ và tên"
            required
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          {/* Email field */}
          <InputField
            id="emailInput"
            name="email"
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          {/* Password field */}
          <InputField
            id="passwordInput"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            required
            value={formData.password}
            onChange={handleChange}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            error={errors.password}
          />

          {/* Confirm password field */}
          <InputField
            id="confirmPasswordInput"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            error={errors.confirmPassword}
          />

          {/* Address field */}
          <InputField
            id="addressInput"
            name="address"
            type="text"
            placeholder="Địa chỉ"
            required
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />

          {/* Phone number field */}
          <InputField
            id="phonenoInput"
            name="phoneno"
            type="tel"
            placeholder="Số điện thoại"
            required
            value={formData.phoneno}
            onChange={handleChange}
            error={errors.phoneno}
          />

          <button
            type="submit"
            className="w-full mt-4 px-4 py-3 text-white bg-[#B08B4F] rounded-md hover:bg-[#976C42] transition duration-300 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
            onClick={(e) => console.log("Register button clicked directly")} // Separate click handler for button
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
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