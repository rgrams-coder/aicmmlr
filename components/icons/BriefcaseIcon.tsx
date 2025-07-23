import React from 'react';

const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.075c0 1.313-.964 2.505-2.296 2.745-1.74.315-3.546.43-5.354.43s-3.614-.115-5.354-.43C6.014 20.73 5.05 19.538 5.05 18.225v-4.075c0-1.313.964-2.505 2.296-2.745 1.74-.315 3.546-.43 5.354-.43s3.614.115 5.354.43c1.332.24 2.296 1.432 2.296 2.745z"
    />
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 8.25h-7.5a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5zM15.75 12h-7.5a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5z"
    />
     <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a.75.75 0 00.75-.75V6.375a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75v11.625c0 .414.336.75.75.75h.75z"
    />
     <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c-4.97 0-9 1.567-9 3.5v11c0 1.933 4.03 3.5 9 3.5s9-1.567 9-3.5v-11C21 4.567 16.97 3 12 3z"
    />
  </svg>
);

export default BriefcaseIcon;
