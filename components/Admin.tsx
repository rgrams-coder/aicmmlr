


import React, { useState, useMemo } from 'react';
import { UserData, ConsultancyCase, ConsultancyStatus, UserCategory, DocumentType, LibraryDocument, Feedback } from '../types';
import { USER_CATEGORIES } from '../constants';
import DocumentFormModal from './DocumentFormModal';
import AdminCaseModal from './AdminCaseModal';
import UsersIcon from './icons/UsersIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import ChatBubbleLeftRightIcon from './icons/ChatBubbleLeftRightIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';


interface AdminProps {
  users: UserData[];
  cases: ConsultancyCase[];
  documents: LibraryDocument[];
  feedbacks: Feedback[];
  onLogout: () => void;
  onAddDocument: (doc: LibraryDocument) => void;
  onUpdateDocument: (doc: LibraryDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onUpdateCase: (caseId: string, solution: string, fee: number, solutionFile: File | null) => void;
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

const DOC_TYPES_META = [
    { key: DocumentType.BARE_ACT, label: 'Bare Acts' },
    { key: DocumentType.NOTIFICATION, label: 'Notifications' },
    { key: DocumentType.CIRCULAR, label: 'Circulars' },
    { key: DocumentType.GOVERNMENT_ORDER, label: 'Govt. Orders' },
    { key: DocumentType.JUDGEMENT, label: 'Judgements' },
];

const Admin: React.FC<AdminProps> = ({ users, cases, documents, feedbacks, onLogout, onAddDocument, onUpdateDocument, onDeleteDocument, onUpdateCase }) => {
  const [activeTab, setActiveTab] = useState('users');
    
  const getUserCategoryLabel = (categoryValue: UserCategory) => {
    return USER_CATEGORIES.find(c => c.value === categoryValue)?.label || 'N/A';
  }

  const [activeLibTab, setActiveLibTab] = useState<DocumentType>(DocumentType.BARE_ACT);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LibraryDocument | null>(null);

  const [selectedCase, setSelectedCase] = useState<ConsultancyCase | null>(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => doc.type === activeLibTab).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [documents, activeLibTab]);

  const handleOpenAddDocModal = () => {
    setEditingDoc(null);
    setIsDocModalOpen(true);
  };

  const handleOpenEditDocModal = (doc: LibraryDocument) => {
    setEditingDoc(doc);
    setIsDocModalOpen(true);
  };
  
  const handleCloseDocModal = () => {
    setIsDocModalOpen(false);
    setEditingDoc(null);
  };
  
  const handleDocFormSubmit = (doc: LibraryDocument) => {
    if (editingDoc) {
      onUpdateDocument(doc);
    } else {
      onAddDocument(doc);
    }
    handleCloseDocModal();
  };
  
  const handleOpenCaseModal = (caseToEdit: ConsultancyCase) => {
    setSelectedCase(caseToEdit);
    setIsCaseModalOpen(true);
  };

  const handleCloseCaseModal = () => {
    setSelectedCase(null);
    setIsCaseModalOpen(false);
  };

  const handleCaseUpdate = (caseId: string, solution: string, fee: number, solutionFile: File | null) => {
    onUpdateCase(caseId, solution, fee, solutionFile);
    handleCloseCaseModal();
  };

  return (
    <>
        <DocumentFormModal
            isOpen={isDocModalOpen}
            onClose={handleCloseDocModal}
            onSubmit={handleDocFormSubmit}
            documentToEdit={editingDoc}
            initialType={activeLibTab}
        />
        <AdminCaseModal 
            isOpen={isCaseModalOpen}
            onClose={handleCloseCaseModal}
            onSubmit={handleCaseUpdate}
            caseToEdit={selectedCase}
        />
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

            <nav className="bg-gray-50 border-b border-gray-200">
              <div className="-mb-px flex justify-start px-4 sm:px-6">
                <button onClick={() => setActiveTab('users')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-brand-secondary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><UsersIcon className="h-5 w-5 mr-2 inline"/> Users</button>
                <button onClick={() => setActiveTab('cases')} className={`ml-8 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'cases' ? 'border-brand-secondary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><BriefcaseIcon className="h-5 w-5 mr-2 inline"/> Consultancy</button>
                <button onClick={() => setActiveTab('library')} className={`ml-8 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'library' ? 'border-brand-secondary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><DocumentTextIcon className="h-5 w-5 mr-2 inline"/> Library</button>
                <button onClick={() => setActiveTab('feedback')} className={`ml-8 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'feedback' ? 'border-brand-secondary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 inline"/> Feedback</button>
              </div>
            </nav>

            <div className="p-6 sm:p-8 bg-brand-light">
              {activeTab === 'users' && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
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
              )}
              {activeTab === 'cases' && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleOpenCaseModal(c)}
                                                className="text-brand-secondary hover:text-brand-primary p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                aria-label="Manage Case"
                                            >
                                                <PencilIcon className="h-5 w-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {cases.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">No cases submitted yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
              )}
              {activeTab === 'library' && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <DocumentTextIcon className="h-8 w-8 text-brand-secondary mr-3"/>
                            <h2 className="text-2xl font-bold text-brand-dark">Library Documents</h2>
                        </div>
                        <button onClick={handleOpenAddDocModal} className="bg-brand-secondary text-white px-4 py-2 rounded-md hover:bg-brand-primary transition-colors flex items-center">
                            <PlusCircleIcon className="h-5 w-5 mr-2"/> Add Document
                        </button>
                    </div>

                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {DOC_TYPES_META.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveLibTab(tab.key)}
                                className={`${ activeLibTab === tab.key
                                    ? 'border-brand-primary text-brand-dark'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                            {tab.label}
                            </button>
                        ))}
                        </nav>
                    </div>

                    <div className="mt-6 rounded-lg overflow-hidden border border-gray-200 max-h-[60vh] overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDocs.map(doc => (
                                    <tr key={doc.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">{doc.title}</a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(doc.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => handleOpenEditDocModal(doc)} className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-gray-100"><PencilIcon className="h-5 w-5"/></button>
                                            <button onClick={() => confirm('Are you sure you want to delete this document?') && onDeleteDocument(doc.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-gray-100"><TrashIcon className="h-5 w-5"/></button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredDocs.length === 0 && (
                                    <tr><td colSpan={3} className="text-center py-8 text-gray-500">No documents in this category.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
              )}
              {activeTab === 'feedback' && (
                  <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
                      <div className="flex items-center mb-4">
                          <ChatBubbleLeftRightIcon className="h-8 w-8 text-brand-secondary mr-3"/>
                          <h2 className="text-2xl font-bold text-brand-dark">User Feedback ({feedbacks.length})</h2>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-gray-200 max-h-[70vh] overflow-y-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                  <tr>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                                  </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                  {feedbacks.map(f => (
                                      <tr key={f.id}>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(f.date).toLocaleString()}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                              <div>{f.userName}</div>
                                              <div className="text-xs text-gray-500">{f.userEmail}</div>
                                          </td>
                                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-pre-wrap max-w-md">{f.feedbackText}</td>
                                      </tr>
                                  ))}
                                  {feedbacks.length === 0 && (
                                      <tr><td colSpan={3} className="text-center py-8 text-gray-500">No feedback received yet.</td></tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
            </div>
        </div>
        </div>
    </>
  );
};

export default Admin;