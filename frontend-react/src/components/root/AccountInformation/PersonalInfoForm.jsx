import React, { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { 
  loadUserProfile, 
  updateUserProfile, 
  resetUpdateStatus,
  getUserFromLocalStorage 
} from "../../../store/UserSlice";

const PersonalInfoForm = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, profileUpdateSuccess } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  // Load user data on component mount
  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (userData) {
      setFormData({
        email: userData.email || "",
        fullName: userData.name || "",
        phoneNumber: userData.phoneno || "",
        address: userData.address || "",
      });
    } else {
      // If no data in localStorage, try to load from Redux
      dispatch(loadUserProfile());
    }
  }, [dispatch]);

  // Update form data when profile is loaded from Redux
  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || "",
        fullName: profile.name || "",
        phoneNumber: profile.phoneno || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  // Show success toast when profile is updated
  useEffect(() => {
    if (profileUpdateSuccess) {
      toast.success("Thông tin đã được cập nhật thành công!");
      setIsEditing(false);
      dispatch(resetUpdateStatus());
    }
  }, [profileUpdateSuccess, dispatch]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetUpdateStatus());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên không được để trống";
    if (!formData.phoneNumber.match(/^\d{10}$/)) newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!formData.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    dispatch(updateUserProfile({
      name: formData.fullName,
      phoneno: formData.phoneNumber,
      address: formData.address,
    }));
  };

  const renderField = (label, name, value, type = "text") => {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        {isEditing ? (
          <>
            <input
              type={type}
              name={name}
              value={value}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors[name] ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 ${errors[name] ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
              disabled={name === "email" || loading}
            />
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
          </>
        ) : (
          <div className="bg-gray-100 p-2 rounded">{value}</div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full sm:w-10/12 mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">THÔNG TIN CÁ NHÂN</h2>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing) {
              setErrors({});
              // Reset form data to current profile data if canceling edit
              if (profile) {
                setFormData({
                  email: profile.email || "",
                  fullName: profile.name || "",
                  phoneNumber: profile.phoneno || "",
                  address: profile.address || "",
                });
              }
            }
          }}
          className="p-2 hover:bg-gray-200 bg-gray-100 rounded-md transition-colors"
          disabled={loading}
        >
          <div className="flex gap-3">
            {isEditing ? (
              <>
                HỦY CHỈNH SỬA
                <X className="w-5 h-5 text-red-600" />
              </>
            ) : (
              <>
                CHỈNH SỬA
                <Pencil className="w-5 h-5 text-gray-600" />
              </>
            )}
          </div>
        </button>
      </div>

      {loading && !formData.email ? (
        <div className="text-center py-4">Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {renderField("EMAIL", "email", formData.email)}
            {renderField("HỌ VÀ TÊN", "fullName", formData.fullName)}
            {renderField("SỐ ĐIỆN THOẠI", "phoneNumber", formData.phoneNumber)}
            {renderField("ĐỊA CHỈ", "address", formData.address)}
          </div>

          {isEditing && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSubmit}
                className={`px-12 py-3 md:py-4 text-base font-semibold text-white uppercase bg-[#B08B4F] hover:bg-[#976C42] rounded-xl shadow-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? "ĐANG CẬP NHẬT..." : "XÁC NHẬN"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PersonalInfoForm;