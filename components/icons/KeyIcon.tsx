import React from 'react';

const KeyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.79-.223 1.142l-6.538 9.807a.75.75 0 00.976 1.124l9.807-6.538c.353-.19.752-.29 1.142-.223A6.75 6.75 0 0015.75 1.5zm-3 8.25a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75z"
      clipRule="evenodd"
    />
  </svg>
);

export default KeyIcon;
