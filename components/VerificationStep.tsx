
import React from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface VerificationStepProps {
  email: string;
  onVerified: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ email, onVerified }) => {
  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center">
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-brand-dark mb-3">
          Registration Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to <br/>
          <span className="font-semibold text-brand-secondary">{email}</span>.
        </p>
        <p className="text-sm text-gray-500 mb-8">
            Please check your inbox (and spam folder) to continue.
        </p>
        <button
          onClick={onVerified}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors"
        >
          Continue to Profile Setup
        </button>
      </div>
    </div>
  );
};

export default VerificationStep;
