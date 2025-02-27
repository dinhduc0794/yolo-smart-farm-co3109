import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../fragments/InputField/InputField';
import { toast } from 'react-toastify';

// Dummy function mô phỏng gửi email OTP
const sendEmailDummy = async (email) => {
  return new Promise((resolve) => {
    console.log("Gửi email đến:", email);
    setTimeout(() => resolve({ success: true }), 500);
  });
};

function VerificationMail() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    await sendEmailDummy(email);
    toast.success("Mã xác nhận đã được gửi đến email của bạn");
    navigate("/verify-newpass");
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 sm:px-0">
      <div className="flex flex-col md:flex-row bg-[#FAF0E6] rounded-lg shadow-lg overflow-hidden w-full max-w-4xl md:h-[500px] mx-4 my-4">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-full">
          <img 
            src="src/images/img-input-mail-1.jpg" // Thay thế với đường dẫn hình ảnh thực tế
            alt="Background"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8 h-full">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-8">
            <a href="/login" className="text-[#8B4513] hover:underline text-lg font-bold">Trở về</a>
            <div className="flex flex-col items-end">
              <span className="text-[#4B3621] text-lg font-bold">Tạo mật khẩu mới</span>
              <span className="text-[#4B3621] text-lg">1/3</span>
            </div>
          </div>

          {/* Password Reset Form */}
          <h2 className="text-2xl font-semibold mb-4 text-[#8B4513]">Quên mật khẩu</h2>
          <p className="text-[#4B3621] mb-6">
            Nhập Email tài khoản của bạn để gửi mã xác nhận thay đổi mật khẩu.
          </p>

          <form onSubmit={handleSubmit} className="mb-6">
            {/* Email Input using InputField */}
            <InputField
              id="emailInput"
              name="email" // Đảm bảo rằng tên là 'email' để dễ lấy giá trị
              type="email"
              placeholder="Email"
              required
              icon="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Envelope_font_awesome.svg/1024px-Envelope_font_awesome.svg.png"
            />

            <button 
              type="submit" 
              className="w-full py-3 mt-6 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition duration-300"
            >
              Tiếp tục
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerificationMail;
