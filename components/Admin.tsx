import React from 'react';
import { UserData, ConsultancyCase, ConsultancyStatus, UserCategory } from '../types';
import { USER_CATEGORIES } from '../constants';
import UsersIcon from './icons/UsersIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';

interface AdminProps {
  users: UserData[];
  cases: ConsultancyCase[];
  onLogout: () => void;
}

const statusStyles: { [key in ConsultancyStatus]: string } = {
  [ConsultancyStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ConsultancyStatus.SOLUTION_READY]: 'bg-blue-100 text-blue-800',
  [ConsultancyStatus.COMPLETED]: 'bg-green-100 text-green-800',
};

const statusText: { [key in ConsultancyStatus]: string } = {
    [ConsultancyStatus.PENDING]: 'Pending',
    [ConsultancyStatus.SOLUTION_READY]: 'Solution Ready',
    [ConsultancyStatus.COMPLETED]: 'Completed',
};

const Admin: React.FC<AdminProps> = ({ users, cases, onLogout }) => {
    
  const getUserCategoryLabel = (categoryValue: UserCategory) => {
    return USER_CATEGORIES.find(c => c.value === categoryValue)?.label || 'N/A';
  }

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-brand-dark p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <button onClick={onLogout} className="text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary px-4 py-2 rounded-md transition-colors">
              Logout
            </button>
          </div>
        </header>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-brand-light">
            {/* Registered Users Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                    <UsersIcon className="h-8 w-8 text-brand-secondary mr-3"/>
                    <h2 className="text-2xl font-bold text-brand-dark">Registered Users ({users.length})</h2>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200 max-h-[60vh] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.email}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getUserCategoryLabel(user.category)}</td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr><td colSpan={3} className="text-center py-8 text-gray-500">No users registered yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Consultancy Cases Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex items-center mb-4">
                    <BriefcaseIcon className="h-8 w-8 text-brand-secondary mr-3"/>
                    <h2 className="text-2xl font-bold text-brand-dark">Consultancy Cases ({cases.length})</h2>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200 max-h-[60vh] overflow-y-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Info</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cases.map(c => (
                                <tr key={c.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div>{c.id}</div>
                                        <div className="text-xs text-gray-500" title={c.userEmail}>{c.userName}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={c.issue}>{c.issue}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[c.status]}`}>
                                            {statusText[c.status]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {cases.length === 0 && (
                                <tr><td colSpan={3} className="text-center py-8 text-gray-500">No cases submitted yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
