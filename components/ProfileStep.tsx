import React, { useState, useMemo } from 'react';
import { ProfileData, UserCategory } from '../types';
import UploadIcon from './icons/UploadIcon';

interface ProfileStepProps {
  userCategory: UserCategory;
  onSubmit: (data: ProfileData) => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ userCategory, onSubmit }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    address: '',
    bio: '',
    profilePicture: null,
    state: '',
    district: '',
    circle: '',
    mauza: '',
    plotNo: '',
    area: '',
    revenueThanaNumber: '',
    thanaPs: '',
    minerals: '',
    natureOfLand: '',
    mineCodeIbm: '',
    mineCodeDgms: '',
    licenceNo: '',
    dealerCodeIbm: '',
    natureOfBusiness: '',
    profession: '',
    designation: '',
    collegeName: '',
    universityName: '',
  });
  const [fileName, setFileName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData((prev) => ({ ...prev, profilePicture: file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profileData);
  };
  
  const isLeaseeType = [UserCategory.LESSEE, UserCategory.FIRM, UserCategory.COMPANY].includes(userCategory);
  const isDealerType = userCategory === UserCategory.MINERAL_DEALER;
  const isOtherType = userCategory === UserCategory.OTHERS;
  const isAcademicType = [UserCategory.STUDENT, UserCategory.RESEARCHER].includes(userCategory);
  
  const isFormValid = useMemo(() => {
    const { address, bio, state, district, circle, mauza, plotNo, area, revenueThanaNumber, thanaPs, minerals, natureOfLand, mineCodeIbm, mineCodeDgms, licenceNo, dealerCodeIbm, natureOfBusiness, profession, designation, collegeName, universityName } = profileData;
    
    if (!address || !bio) return false;

    if (isLeaseeType) {
      return !!(state && district && circle && mauza && plotNo && area && revenueThanaNumber && thanaPs && minerals && natureOfLand && mineCodeIbm && mineCodeDgms);
    }
    if (isDealerType) {
      return !!(licenceNo && minerals && dealerCodeIbm && natureOfBusiness);
    }
    if (isOtherType) {
      return !!(profession && designation);
    }
    if (isAcademicType) {
      return !!(collegeName && universityName);
    }
    return false;
  }, [profileData, isLeaseeType, isDealerType, isOtherType, isAcademicType]);

  const renderCategorySpecificFields = () => {
    if (isLeaseeType) {
      return (
        <>
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Mine & Location Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="state" placeholder="State" value={profileData.state} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="district" placeholder="District" value={profileData.district} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="circle" placeholder="Circle" value={profileData.circle} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="mauza" placeholder="Mauza" value={profileData.mauza} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="plotNo" placeholder="Plot No." value={profileData.plotNo} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="area" placeholder="Area (e.g., 5.2 Hectares)" value={profileData.area} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="revenueThanaNumber" placeholder="Revenue Thana Number" value={profileData.revenueThanaNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="thanaPs" placeholder="Thana / PS" value={profileData.thanaPs} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="minerals" placeholder="Minerals" value={profileData.minerals} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="natureOfLand" placeholder="Nature of Land" value={profileData.natureOfLand} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="mineCodeIbm" placeholder="Mine Code (issued by IBM)" value={profileData.mineCodeIbm} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="mineCodeDgms" placeholder="Mine Code (issued by DGMS)" value={profileData.mineCodeDgms} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
          </div>
        </>
      );
    }
    if (isDealerType) {
      return (
        <>
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Dealer Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="licenceNo" placeholder="Licence No." value={profileData.licenceNo} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="minerals" placeholder="Mineral Name(s)" value={profileData.minerals} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="dealerCodeIbm" placeholder="Dealer Code (issued by IBM)" value={profileData.dealerCodeIbm} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="natureOfBusiness" placeholder="Nature of Business" value={profileData.natureOfBusiness} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
          </div>
        </>
      );
    }
    if (isOtherType) {
      return (
        <>
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Official Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="profession" placeholder="Profession" value={profileData.profession} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="designation" placeholder="Designation" value={profileData.designation} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
          </div>
        </>
      );
    }
    if (isAcademicType) {
      return (
        <>
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Academic Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="collegeName" placeholder="College Name" value={profileData.collegeName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
            <input type="text" name="universityName" placeholder="University Name" value={profileData.universityName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
          </div>
        </>
      );
    }
    return null;
  };


  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-brand-dark">Complete Your Profile</h2>
          <p className="text-gray-500">Add a few more details to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
             <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
              General Information
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="address" id="address" placeholder="Your street address" value={profileData.address} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio / Short Description</label>
                <textarea name="bio" id="bio" rows={4} placeholder="Tell us a little about yourself or your organization" value={profileData.bio} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
              </div>
            </div>
          </div>
          
          <div>
            {renderCategorySpecificFields()}
          </div>

           <div>
             <h3 className="text-lg font-medium text-gray-900">
              Profile Picture
            </h3>
            <label htmlFor="profile-picture-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-secondary hover:text-brand-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-secondary">
              <div className="mt-1 flex items-center space-x-4 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                 <UploadIcon className="h-12 w-12 text-gray-400" />
                 <div className="flex flex-col">
                    <span className="p-2">Upload a profile picture</span>
                    <p className="text-xs text-gray-500 pl-2">PNG, JPG up to 5MB</p>
                    {fileName && <p className="text-sm text-green-600 mt-1 pl-2">{fileName}</p>}
                 </div>
                 <input id="profile-picture-upload" name="profile-picture-upload" type="file" className="sr-only" onChange={handleFileChange} />
              </div>
            </label>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={!isFormValid} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              Finish & Go to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileStep;