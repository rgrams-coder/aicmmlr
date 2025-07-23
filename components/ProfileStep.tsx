
import React, { useState } from 'react';
import { ProfileData } from '../types';
import UploadIcon from './icons/UploadIcon';

interface ProfileStepProps {
  onSubmit: (data: ProfileData) => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ onSubmit }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    address: '',
    bio: '',
    profilePicture: null,
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
  
  const isFormValid = profileData.address && profileData.bio;

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-brand-dark">Complete Your Profile</h2>
          <p className="text-gray-500">Add a few more details to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
             <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
            </label>
            <input type="text" name="address" id="address" placeholder="Your street address" value={profileData.address} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
          </div>

          <div>
             <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio / Short Description
            </label>
            <textarea name="bio" id="bio" rows={4} placeholder="Tell us a little about yourself or your organization" value={profileData.bio} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
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
            <button type="submit" disabled={!isFormValid} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-400 transition-colors">
              Finish & Go to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileStep;
