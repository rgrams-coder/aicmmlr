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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit(email, password);
      setIsLoading(false);
    }, 1000);
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
    </div>
  );
};

export default LoginStep;
