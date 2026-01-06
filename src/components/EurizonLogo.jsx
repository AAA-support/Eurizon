import React from 'react';

const EurizonLogo = ({ variant = 'light', size = 'normal' }) => {
  const textColor = variant === 'dark' ? '#000000' : '#FFFFFF';
  const sizeClasses = {
    small: 'w-32',
    normal: 'w-48',
    large: 'w-64'
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto`}>
      <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
        {/* Wave Design */}
        <g>
          {/* Outer dark blue wave */}
          <path
            d="M 50 150 Q 70 180 90 210 Q 110 240 130 270 Q 150 300 170 330"
            stroke="#1e3a8a"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
          />

          {/* Middle blue wave */}
          <path
            d="M 70 150 Q 90 180 110 210 Q 130 240 150 270 Q 170 300 190 330"
            stroke="#3b82f6"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
          />

          {/* Inner light wave */}
          <path
            d="M 90 150 Q 110 180 130 210 Q 150 240 170 270 Q 190 300 210 330"
            stroke="#93c5fd"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
          />

          {/* Vertical bars */}
          <rect x="104" y="180" width="16" height="80" fill={textColor} />
          <rect x="143" y="150" width="24" height="110" fill={textColor} />
        </g>

        {/* Text */}
        <g>
          <text x="187" y="195" fill={textColor} fontSize="42" fontWeight="bold" fontFamily="Arial, sans-serif">
            EURIZON
          </text>
          <text x="187" y="235" fill={textColor} fontSize="42" fontWeight="bold" fontFamily="Arial, sans-serif">
            INVESTMENT
          </text>
          <text x="187" y="270" fill={textColor} fontSize="28" fontWeight="normal" fontFamily="Arial, sans-serif">
            SICCAV LUXEMBOURG
          </text>
        </g>
      </svg>
    </div>
  );
};

export default EurizonLogo;
