import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

function Verification({ isNewPass = false }) {
  const navigate = useNavigate();

  // Dummy studentDTO (sinh viên mẫu)
  const studentDTO = { name: "John Doe", id: "S001" };

  // Mã OTP được lưu trong mảng 6 phần tử
  const [otp, setOtp] = useState(Array(6).fill(''));
  // Lấy email từ localStorage (hoặc dùng giá trị mặc định nếu không có)
  const email = localStorage.getItem('email') || "dummy@example.com";

  const handleChange = (index, value) => {
    if (value.match(/^[0-9]$/) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Tự động chuyển focus sang ô tiếp theo nếu có giá trị
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  // Dummy function mô phỏng lấy OTP từ email (OTP mẫu là "123456")
  const getOTPbyEmailDummy = async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { otp_code: "123456" } });
      }, 500);
    });
  };

  // Dummy function mô phỏng thêm sinh viên
  const addStudentDummy = (studentDTO) => {
    console.log("Student added", studentDTO);
  };

  // Dummy function mô phỏng gửi OTP qua email
  const sendEmailDummy = (email) => {
    console.log("OTP sent to email", email);
    toast.success("Đã gửi OTP đến email của bạn");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const otpCode = otp.join('');
    const fetchOTP = async () => {
      const otpResponse = await getOTPbyEmailDummy(email);
      if (otpCode === otpResponse.data.otp_code) {
        if (isNewPass) {
          navigate("/newpassword");
        } else {
          addStudentDummy(studentDTO);
          navigate("/login");
        }
      } else {
        toast.error("OTP không trùng khớp");
        return;
      }
    };
    fetchOTP();
  };

  // Cooldown cho việc gửi lại OTP
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resendOTP = () => {
    if (cooldown === 0) {
      sendEmailDummy(email);
      setCooldown(10);
    } else {
      toast.info("Hãy đợi thêm " + cooldown + " giây");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 sm:px-0">
      <div className="flex flex-col md:flex-row bg-[#FAF0E6] rounded-lg shadow-lg overflow-hidden w-full max-w-4xl md:h-[500px] mx-4 my-4">
        {/* Phần hình ảnh */}
        <div className="w-full md:w-1/2 h-64 md:h-full">
          <img
            src={isNewPass ? "src/images/img-input-mail-2.jpg" : "src/images/img-verify.jpg"}
            alt="Background"
            className="object-cover w-full h-full"
          />
        </div>
        {/* Form xác minh OTP */}
        <div className="w-full md:w-1/2 p-8 h-full">
          <div className="flex justify-between items-center mb-8">
            <a href={isNewPass ? "/verifymail" : "/register"} className="text-[#8B4513] hover:underline text-lg font-bold">
              Trở về
            </a>
            <div className="flex flex-col items-end">
              <span className="text-[#4B3621] text-lg font-bold">{isNewPass ? "Tạo mật khẩu mới" : "Đăng ký"}</span>
              <span className="text-[#4B3621] text-lg">{isNewPass ? "2/3" : "2/2"}</span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-[#8B4513]">Kiểm tra Mail của bạn</h2>
          <p className="text-gray-600 mb-6">
            Chúng tôi đã gửi một mã gồm 6 số đến <span className="font-medium text-[#8B4513]">{email}</span>. Hãy nhập đúng mã vào ô bên dưới.
          </p>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={value}
                  maxLength="1"
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-12 h-12 font-bold text-center border border-[#8B4513] rounded-md focus:outline-none focus:border-[#A0522D]"
                  required
                />
              ))}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-[80%] md:w-full py-3 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition duration-300"
              >
                Xác nhận
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-gray-600">
              Bạn chưa nhận được mã?{' '}
              <a onClick={resendOTP} href="#" className="text-[#8B4513] hover:underline font-bold">
                Gửi lại mã
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verification;
