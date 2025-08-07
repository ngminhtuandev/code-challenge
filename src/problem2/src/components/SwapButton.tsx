import React from 'react';

interface SwapButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const SwapButton: React.FC<SwapButtonProps> = ({ onClick, isLoading }) => {
  return (
    <div className="flex justify-center -my-2 z-10">
      <button
        type="button"
        onClick={onClick}
        className="p-2 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-600 hover:text-white transition-colors duration-200 shadow-lg border border-gray-700
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      </button>
    </div>
  );
};

export default SwapButton;
