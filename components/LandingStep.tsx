import React, { useState } from 'react';
import { UserCategory } from '../types';
import { USER_CATEGORIES } from '../constants';
import MiningIcon from './icons/MiningIcon';

interface LandingStepProps {
  onSelectCategory: (category: UserCategory) => void;
  onLoginClick: () => void;
}

const LandingStep: React.FC<LandingStepProps> = ({ onSelectCategory, onLoginClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<UserCategory | ''>('');

  const handleProceed = () => {
    if (selectedCategory) {
      onSelectCategory(selectedCategory);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <MiningIcon className="w-16 h-16 text-brand-secondary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-brand-dark">
            Mines & Minerals Law
          </h1>
          <p className="text-gray-600 mt-2">Your Digital Legal Ecosystem</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="user-category" className="block text-sm font-medium text-gray-700 mb-1">
              Select Your Category to Register
            </label>
            <select
              id="user-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as UserCategory)}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm rounded-md shadow-sm"
            >
              <option value="" disabled>Choose an option...</option>
              {USER_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleProceed}
            disabled={!selectedCategory}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Proceed to Registration
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>
            <button
              onClick={onLoginClick}
              className="font-medium text-brand-secondary hover:text-brand-primary ml-1"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingStep;
