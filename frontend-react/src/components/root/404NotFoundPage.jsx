import React from 'react';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  const handleGoHome = () => {
    // Simple home navigation using window location
    window.location.href = '/';
  };

  const handleGoBack = () => {
    // Use browser's history to go back
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <AlertTriangle 
            size={80} 
            className="text-yellow-500"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Trang Không Tìm Thấy
        </h1>
        
        <p className="text-gray-600 mb-6">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        
        <div className="flex flex-col space-y-4">
          <button 
            onClick={handleGoHome}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Quay Về Trang Chủ
          </button>
          
          <button 
            onClick={handleGoBack}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Quay Lại Trang Trước
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;