import React, { useState } from 'react';
import KeyIcon from './icons/KeyIcon';

interface LoginStepProps {
  onSubmit: (email: string, pass: string) => void;
  onSwitchToRegister: () => void;
}

const LoginStep: React.FC<LoginStepProps> = ({ onSubmit, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsResetting(true);
    try {
      // Add API call for password reset
      alert('Password reset link sent to your email!');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (error) {
      alert('Failed to send reset email. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <KeyIcon className="w-16 h-16 text-brand-secondary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-brand-dark">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">Log in to access your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
          />

          <button
            type="submit"
            disabled={!email || !password || isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-brand-secondary hover:text-brand-primary"
          >
            Forgot Password?
          </button>
        </div>

        <div className="text-center text-sm mt-6">
          <span className="text-gray-600">Don't have an account?</span>
          <button
            onClick={onSwitchToRegister}
            className="font-medium text-brand-secondary hover:text-brand-primary ml-1"
          >
            Register Now
          </button>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-brand-primary">Reset Password</h3>
              <button onClick={() => setShowForgotPassword(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Email Address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary mb-4"
              />
              <button
                type="submit"
                disabled={!forgotEmail || isResetting}
                className="w-full py-3 px-4 bg-brand-secondary text-white rounded-md hover:bg-brand-primary disabled:bg-gray-400 transition-colors"
              >
                {isResetting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginStep;
