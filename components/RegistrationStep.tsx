import React, { useState } from 'react';
import { RegistrationFormData, UserCategory, UserCategoryInfo } from '../types';
import { USER_CATEGORIES } from '../constants';

interface RegistrationStepProps {
  userCategory: UserCategory;
  onSubmit: (data: RegistrationFormData) => void;
  onBack: () => void;
}

const RegistrationStep: React.FC<RegistrationStepProps> = ({ userCategory, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<Omit<RegistrationFormData, 'password'>>({
    name: '',
    email: '',
    phone: '',
    organization: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const categoryInfo = USER_CATEGORIES.find(cat => cat.value === userCategory) as UserCategoryInfo;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    setIsPaying(true);
    // Mock payment processing
    setTimeout(() => {
      onSubmit({ ...formData, password });
    }, 1500);
  };

  const isFormValid = formData.name && formData.email && formData.phone && password && password === confirmPassword;

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-brand-dark">Registration</h2>
          <p className="text-gray-500">
            For Category: <span className="font-semibold text-brand-secondary">{categoryInfo.label}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
              Personal/Organization Details
            </h3>
            <div className="space-y-4">
              <input type="text" name="name" placeholder="Full Name / Organization Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
              {categoryInfo.type === 'PREMIUM' && (
                <input type="text" name="organization" placeholder="Firm/Company Name (if applicable)" value={formData.organization} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
              Contact & Security
            </h3>
            <div className="space-y-4">
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
              <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={!isFormValid || isPaying} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              {isPaying ? 'Processing Payment...' : 'Proceed to Secure Payment'}
            </button>
             <button type="button" onClick={onBack} className="w-full text-center mt-4 text-sm font-medium text-gray-600 hover:text-brand-primary">
                Back
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationStep;
