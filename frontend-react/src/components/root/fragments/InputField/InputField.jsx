import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({
  id,
  name,
  type,
  placeholder,
  required,
  value,
  onChange,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  error
}) => {
  return (
    <div className="mb-4 relative">
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={`w-full p-3 pl-3 rounded-md border transition
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#B08B4F]'} 
            focus:outline-none focus:ring-1 text-[#5A4637]`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-[#8B7355]" />
            ) : (
              <Eye className="h-5 w-5 text-[#8B7355]" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default InputField;
