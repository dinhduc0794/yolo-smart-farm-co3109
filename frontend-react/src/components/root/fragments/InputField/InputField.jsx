import React from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import PropTypes from 'prop-types';

function InputField({ 
  id, 
  name, 
  type = "text", 
  placeholder, 
  required = false, 
  icon, 
  showPasswordToggle = false, 
  showPassword = false, 
  onTogglePassword = () => {}, 
  value,
  defaultValue,        
  onChange,
  min      
}) {
  return (
    <div className="flex items-center px-4 py-2 mt-4 w-full text-base font-medium bg-white rounded-xl border border-gray-300 relative">
      {icon && (
        typeof icon === 'string' ? (
          <img
            loading="lazy"
            src={icon}
            alt="icon"
            className="object-contain shrink-0 w-6 h-6 mr-6"
          />
        ) : (
          <div className="mr-6 w-6 h-6">
            {icon}
          </div>
        )
      )}
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : type}
        placeholder={placeholder}
        required={required}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className="flex-auto rounded-md pl-3 py-1 outline-none"
        aria-label={placeholder || name}
        min={min}
      />
      {showPasswordToggle && (
        <button 
          type="button" 
          className="absolute right-5 top-[30%] cursor-pointer"
          onClick={onTogglePassword} 
          aria-label="Toggle password visibility"
        >
          {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
        </button>
      )}
    </div>
  );
}

InputField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  showPasswordToggle: PropTypes.bool,
  showPassword: PropTypes.bool,
  onTogglePassword: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default InputField;
