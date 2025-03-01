import React, { useState } from "react";
import { Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PersonalInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "name.lastname@hcmut.edu.vn",
    fullName: "Nguyen Van A",
    phoneNumber: "0123456789",
    dateOfBirth: "1990-01-01",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên không được để trống";
    if (!formData.phoneNumber.match(/^\d{10}$/)) newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    toast.success("Thông tin đã được cập nhật thành công!");
    setIsEditing(false);
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
            if (!isEditing) setErrors({});
          }}
          className="p-2 hover:bg-gray-200 bg-gray-100 rounded-md transition-colors"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {renderField("EMAIL", "email", formData.email)}
        {renderField("HỌ VÀ TÊN", "fullName", formData.fullName)}
        {renderField("SỐ ĐIỆN THOẠI", "phoneNumber", formData.phoneNumber)}
        {renderField("NGÀY SINH", "dateOfBirth", formData.dateOfBirth, "date")}
      </div>

      {isEditing && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="px-12 py-3 md:py-4 text-base font-semibold text-white uppercase bg-[#B08B4F] hover:bg-[#976C42] rounded-xl shadow-lg transition-colors"
          >
            XÁC NHẬN
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;