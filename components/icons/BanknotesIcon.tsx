import React from 'react';

const BanknotesIcon = ({ className }: { className?: string }) => (
    <svg 
        className={className}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
        aria-hidden="true"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-1.5a.75.75 0 01-.75-.75V4.5m0 0h-1.5m-15.75 0H5.625c.621 0 1.125.504 1.125 1.125v17.25c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125zm18 0h-1.5a.75.75 0 00-.75.75v17.25c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125z" 
        />
    </svg>
);

export default BanknotesIcon;
