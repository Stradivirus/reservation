import React from 'react';

const SuccessAlert = ({ message, createdAt, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 w-96 bg-white border border-green-500 rounded-lg shadow-lg p-4 animate-in fade-in slide-in-from-top-2 z-50">
      <div className="flex items-center">
        <svg 
          className="h-5 w-5 text-green-500 mr-2" 
          fill="none" 
          strokeWidth="2" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-green-700 font-semibold">등록 완료!</h3>
      </div>
      <div className="mt-2">
        <p className="text-gray-700">{message}</p>
        <p className="text-sm text-gray-500 mt-1">등록 시간: {createdAt}</p>
      </div>
    </div>
  );
};

export default SuccessAlert;