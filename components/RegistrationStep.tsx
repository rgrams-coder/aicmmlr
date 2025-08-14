
import React, { useState } from 'react';
import { RegistrationFormData, UserCategory, UserCategoryInfo } from '../types';
import { USER_CATEGORIES } from '../constants';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

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
  const [isProcessing, setIsProcessing] = useState(false);

  const categoryInfo = USER_CATEGORIES.find(cat => cat.value === userCategory) as UserCategoryInfo;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const displayRazorpay = async () => {
    try {
      const { apiService } = await import('../services/api');
      const orderData = await apiService.createOrder(categoryInfo.price);
      
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Mines and Minerals Laws Ecosystem",
        description: `Registration Fee for ${categoryInfo.label}`,
        handler: async (response: RazorpayResponse) => {
          try {
            await apiService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            onSubmit({ ...formData, password });
          } catch (error) {
            alert('Payment verification failed');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#1a3b5d",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };
      
      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', function (response: any){
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (error) {
      alert('Failed to create order');
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    setIsProcessing(true);
    displayRazorpay();
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
          <p className="font-bold text-2xl text-brand-accent mt-2">
            Registration Fee: ₹{categoryInfo.price}
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
            <button type="submit" disabled={!isFormValid || isProcessing} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              {isProcessing ? 'Processing...' : `Pay ₹${categoryInfo.price} and Register`}
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