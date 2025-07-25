
import React, { useState, useMemo } from 'react';
import { UserData, ConsultancyCase, ConsultancyStatus, UserCategory, DocumentType, LibraryDocument } from '../types';
import { USER_CATEGORIES } from '../constants';
import UsersIcon from './icons/UsersIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import DocumentFormModal from './DocumentFormModal';


interface AdminProps {
  users: UserData[];
  cases: ConsultancyCase[];
  documents: LibraryDocument[];
  onLogout: () => void;
  onAddDocument: (doc: LibraryDocument) => void;
  onUpdateDocument: (doc: LibraryDocument) => void;
  onDeleteDocument: (docId: string) => void;
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

const Admin: React.FC<AdminProps> = ({ users, cases, documents, onLogout, onAddDocument, onUpdateDocument, onDeleteDocument }) => {
    
  const getUserCategoryLabel = (categoryValue: UserCategory) => {
    return USER_CATEGORIES.find(c => c.value === categoryValue)?.label || 'N/A';
  }

  const [activeLibTab, setActiveLibTab] = useState<DocumentType>(DocumentType.BARE_ACT);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LibraryDocument | null>(null);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => doc.type === activeLibTab).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [documents, activeLibTab]);

  const handleOpenAddModal = () => {
    setEditingDoc(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doc: LibraryDocument) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoc(null);
  };
  
  const handleFormSubmit = (doc: LibraryDocument) => {
    if (editingDoc) {
      onUpdateDocument(doc);
    } else {
      onAddDocument(doc);
    }
    handleCloseModal();
  };

  return (
    <>
        <DocumentFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleFormSubmit}
            documentToEdit={editingDoc}
            initialType={activeLibTab}
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

            {/* Library Management Section */}
            <div className="p-6 sm:p-8 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <div className="flex items-center">
                        <DocumentTextIcon className="h-8 w-8 text-brand-secondary mr-3"/>
                        <h2 className="text-2xl font-bold text-brand-dark">Library Management</h2>
                    </div>
                    <button onClick={handleOpenAddModal} className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                        <PlusCircleIcon className="h-5 w-5"/>
                        Add New Document
                    </button>
                </div>
                
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                        {DOC_TYPES_META.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveLibTab(tab.key)}
                                className={`${ activeLibTab === tab.key ? 'border-brand-accent text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' } flex-shrink-0 whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm transition-colors`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 max-h-[60vh] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDocs.map(doc => (
                                <tr key={doc.id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-md truncate" title={doc.title}>
                                        {doc.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => handleOpenEditModal(doc)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition-colors" aria-label="Edit document">
                                            <PencilIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => onDeleteDocument(doc.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors" aria-label="Delete document">
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
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
        </div>
        </div>
    </>
  );
};

export default Admin;