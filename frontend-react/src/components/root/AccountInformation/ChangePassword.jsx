import React, { useState, useEffect } from "react";
import InputField from "../fragments/InputField/InputField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPassword, resetUpdateStatus } from "../../../store/UserSlice";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch();
  const { profile, loading, error, passwordUpdateSuccess } = useSelector(state => state.user);
  const username = profile?.username;
  
  useEffect(() => {
    if (passwordUpdateSuccess) {
      toast.success("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      dispatch(resetUpdateStatus());
    }
    
    if (error) {
      toast.error(error);
      dispatch(resetUpdateStatus());
    }
  }, [passwordUpdateSuccess, error, dispatch]);
  
  const HandlePassword = () => {
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp với mật khẩu xác nhận!");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    
    // Dispatch action to update password
    dispatch(updateUserPassword({
      curPassword: currentPassword,
      newPassword: newPassword
    }));
  };

  return (
    <div className="w-full sm:w-3/5 m-auto bg-white shadow-md rounded-lg p-6 sm:p-10 mt-10">
      <h2 className="text-2xl font-bold mb-8 justify-center flex">
        THAY ĐỔI MẬT KHẨU
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">MẬT KHẨU HIỆN TẠI</label>
          <InputField
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Mật khẩu hiện tại"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            showPasswordToggle
            showPassword={showCurrentPassword}
            onTogglePassword={() =>
              setShowCurrentPassword(!showCurrentPassword)
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">MẬT KHẨU MỚI</label>
          <InputField
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="Mật khẩu mới"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showPasswordToggle
            showPassword={showNewPassword}
            onTogglePassword={() => setShowNewPassword(!showNewPassword)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">NHẬP LẠI MẬT KHẨU MỚI</label>
          <InputField
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={HandlePassword}
          disabled={loading}
          className={`self-center px-12 py-4 text-base font-semibold text-white uppercase bg-[#B08B4F] hover:bg-[#976C42] transition duration-300 rounded-xl w-full sm:w-auto shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN"}
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
