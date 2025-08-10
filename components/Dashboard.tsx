import React from 'react';
import { UserData, UserType, UserCategory } from '../types';
import { USER_CATEGORIES } from '../constants';

interface DashboardProps {
  userData: UserData;
  onEnterLibrary: () => void;
  onEnterConsultancy: () => void;
  onSubscribe: () => void;
  onEditProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, onEnterLibrary, onEnterConsultancy, onSubscribe, onEditProfile }) => {
  const categoryInfo = USER_CATEGORIES.find(cat => cat.value === userData.category);

  if (!categoryInfo) {
    return <div>Error: User category not found.</div>;
  }

  const hasConsultancyAccess = categoryInfo.type === UserType.PREMIUM;
  const consultancyMessage = hasConsultancyAccess
      ? 'Connect with legal experts for personalized advice.'
      : 'Upgrade to a Premium account for access.';

  const hasLibraryAccess = userData.hasActiveSubscription;
  
  const renderCategoryDetails = () => {
    const isLeaseeType = [UserCategory.LESSEE, UserCategory.FIRM, UserCategory.COMPANY].includes(userData.category);
    const isDealerType = userData.category === UserCategory.MINERAL_DEALER;
    const isGovernmentType = userData.category === UserCategory.GOVERNMENT_OFFICIAL;
    const isAcademicType = [UserCategory.STUDENT, UserCategory.RESEARCHER].includes(userData.category);

    const detailItem = (label: string, value?: string) => value ? <p><strong className="text-gray-600">{label}:</strong> {value}</p> : null;

    if (!isLeaseeType && !isDealerType && !isGovernmentType && !isAcademicType) {
        return null;
    }

    return (
        <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
            <h4 className="text-md font-semibold text-brand-dark mb-3 border-b pb-2">Category Specific Details</h4>
            {isLeaseeType && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {detailItem('State', userData.state)}
                    {detailItem('District', userData.district)}
                    {detailItem('Circle', userData.circle)}
                    {detailItem('Mauza', userData.mauza)}
                    {detailItem('Plot No.', userData.plotNo)}
                    {detailItem('Area', userData.area)}
                    {detailItem('Revenue Thana', userData.revenueThanaNumber)}
                    {detailItem('Thana/PS', userData.thanaPs)}
                    {detailItem('Minerals', userData.minerals)}
                    {detailItem('Nature of Land', userData.natureOfLand)}
                    {detailItem('IBM Mine Code', userData.mineCodeIbm)}
                    {detailItem('DGMS Mine Code', userData.mineCodeDgms)}
                </div>
            )}
             {isDealerType && (
                <div className="space-y-1 text-sm">
                    {detailItem('Licence No.', userData.licenceNo)}
                    {detailItem('Minerals', userData.minerals)}
                    {detailItem('IBM Dealer Code', userData.dealerCodeIbm)}
                    {detailItem('Nature of Business', userData.natureOfBusiness)}
                </div>
            )}
            {isGovernmentType && (
                 <div className="space-y-1 text-sm">
                    {detailItem('Department', userData.department)}
                    {detailItem('Designation', userData.designation)}
                </div>
            )}
            {isAcademicType && (
                 <div className="space-y-1 text-sm">
                    {detailItem('College', userData.collegeName)}
                    {detailItem('University', userData.universityName)}
                </div>
            )}
        </div>
    )
  }

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
              <button
                onClick={onEditProfile}
                className="w-full mt-4 bg-brand-primary text-white py-2 rounded-md hover:bg-opacity-90 transition"
              >
                Edit Profile
              </button>
              {renderCategoryDetails()}
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
                <div className={`p-6 rounded-lg border ${hasLibraryAccess ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                    <h4 className="font-bold text-brand-dark mb-2">Digital Library</h4>
                    {hasLibraryAccess ? (
                        <>
                            <p className="text-sm text-green-700 font-semibold mb-4">✓ Subscribed</p>
                            <p className="text-sm text-gray-600 mb-4">You have full access. Explore a vast collection of laws, articles, and case studies.</p>
                            <button onClick={onEnterLibrary} className="w-full bg-brand-primary text-white py-2 rounded-md hover:bg-opacity-90 transition">
                                Enter Library
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 mb-2">Access an exhaustive collection of legal documents.</p>
                            <p className="text-sm text-brand-dark font-semibold mb-4">
                                Annual Subscription: ₹{categoryInfo.subscriptionPrice.toLocaleString()}
                            </p>
                            <button onClick={onSubscribe} className="w-full bg-brand-accent text-brand-dark font-semibold py-2 rounded-md hover:opacity-90 transition">
                                Subscribe Now
                            </button>
                        </>
                    )}
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