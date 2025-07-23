import React from 'react';
import { UserData, UserType } from '../types';
import { USER_CATEGORIES } from '../constants';

interface DashboardProps {
  userData: UserData;
  onReset: () => void;
  onEnterLibrary: () => void;
  onEnterConsultancy: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, onReset, onEnterLibrary, onEnterConsultancy }) => {
  const categoryInfo = USER_CATEGORIES.find(cat => cat.value === userData.category);

  if (!categoryInfo) {
    return <div>Error: User category not found.</div>;
  }

  const hasConsultancyAccess = categoryInfo.type === UserType.PREMIUM;
  const consultancyMessage = hasConsultancyAccess
      ? 'Connect with legal experts for personalized advice.'
      : 'Upgrade to a Premium account for access.';

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-brand-dark p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {userData.name}</h1>
              <p className="text-brand-light mt-1">
                Your role: <span className="font-semibold text-brand-accent">{categoryInfo.label}</span>
              </p>
            </div>
            <button
                onClick={onReset}
                className="text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary px-4 py-2 rounded-md transition-colors"
            >
                Start Over
            </button>
          </div>
        </header>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-brand-light p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-brand-dark mb-4 border-b border-gray-300 pb-2">Profile Summary</h3>
              <div className="space-y-3 text-sm">
                <p><strong className="text-gray-600">Email:</strong> {userData.email}</p>
                <p><strong className="text-gray-600">Phone:</strong> {userData.phone}</p>
                <p><strong className="text-gray-600">Address:</strong> {userData.address}</p>
                {userData.organization && <p><strong className="text-gray-600">Organization:</strong> {userData.organization}</p>}
                <p className="pt-2"><strong className="text-gray-600">Bio:</strong> {userData.bio}</p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-brand-secondary text-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Your Access Level</h3>
                <p className="text-2xl font-bold text-brand-accent">
                  {categoryInfo.type === UserType.PREMIUM ? 'Premium Access' : 'Academic Access'}
                </p>
                <p className="mt-1 opacity-90">
                  {categoryInfo.type === UserType.PREMIUM
                    ? 'Full access to all platform features.'
                    : 'Access to our digital library resources.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-brand-dark mb-2">Digital Library</h4>
                  <p className="text-sm text-gray-600 mb-4">Explore a vast collection of laws, articles, and case studies.</p>
                  <button onClick={onEnterLibrary} className="w-full bg-brand-primary text-white py-2 rounded-md hover:bg-opacity-90 transition">
                    Enter Library
                  </button>
                </div>

                <div className={`p-6 rounded-lg border ${hasConsultancyAccess ? 'bg-gray-50 border-gray-200' : 'bg-gray-200 border-gray-300'}`}>
                  <h4 className={`font-bold ${hasConsultancyAccess ? 'text-brand-dark' : 'text-gray-500'}`}>Consultancy Services</h4>
                  <p className={`text-sm mb-4 ${hasConsultancyAccess ? 'text-gray-600' : 'text-gray-500'}`}>
                     {consultancyMessage}
                  </p>
                  <button
                    disabled={!hasConsultancyAccess}
                    onClick={onEnterConsultancy}
                    className="w-full bg-brand-primary text-white py-2 rounded-md hover:bg-opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {hasConsultancyAccess ? 'Book a Consultation' : 'Access Denied'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;