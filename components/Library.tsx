
import React, { useState, useMemo, useEffect } from 'react';
import { apiService } from '../services/api';
import { DocumentType, LibraryDocument } from '../types';
import DocumentTextIcon from './icons/DocumentTextIcon';
import XCircleIcon from './icons/XCircleIcon';
import SearchIcon from './icons/SearchIcon';

interface LibraryProps {
  documents: LibraryDocument[];
  onBackToDashboard: () => void;
}

const DOCUMENT_TYPES = [
  { key: DocumentType.BARE_ACT, label: 'Bare Acts' },
  { key: DocumentType.NOTIFICATION, label: 'Notifications' },
  { key: DocumentType.CIRCULAR, label: 'Circulars' },
  { key: DocumentType.GOVERNMENT_ORDER, label: 'Govt. Orders' },
  { key: DocumentType.JUDGEMENT, label: 'Judgements' },
];

const Library: React.FC<LibraryProps> = ({ documents: initialDocuments, onBackToDashboard }) => {
  const [documents, setDocuments] = useState<LibraryDocument[]>(initialDocuments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await apiService.getDocuments();
        setDocuments(response.documents);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);
  const [activeTab, setActiveTab] = useState<DocumentType>(DocumentType.BARE_ACT);
  const [selectedDoc, setSelectedDoc] = useState<LibraryDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return documents.filter(doc => {
        const matchesCategory = doc.type === activeTab;
        if (!matchesCategory) return false;

        if (!lowercasedSearchTerm) return true;

        const matchesTitle = doc.title.toLowerCase().includes(lowercasedSearchTerm);
        const matchesDescription = doc.description.toLowerCase().includes(lowercasedSearchTerm);
        return matchesTitle || matchesDescription;
    });
  }, [activeTab, searchTerm, documents]);

  const handleTabClick = (tabKey: DocumentType) => {
    setActiveTab(tabKey);
    setSearchTerm(''); // Reset search on tab change
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <header className="bg-brand-dark p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Digital Library</h1>
              <button
                  onClick={onBackToDashboard}
                  className="text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary px-4 py-2 rounded-md transition-colors"
              >
                  Back to Dashboard
              </button>
            </div>
             <div className="mt-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder={`Search in ${DOCUMENT_TYPES.find(t => t.key === activeTab)?.label}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-primary text-white placeholder-gray-400 border border-brand-secondary rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors"
                />
            </div>
          </header>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
              {DOCUMENT_TYPES.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={`${
                    activeTab === tab.key
                      ? 'border-brand-accent text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6 bg-brand-light min-h-[60vh]">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading documents...</p>
              </div>
            ) : (
            <ul className="space-y-4">
              {filteredDocuments.map(doc => (
                 <li key={doc.id} onClick={() => {
                   console.log('Selected doc:', doc);
                   setSelectedDoc(doc);
                 }} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                    <div className="flex items-start space-x-4">
                        <DocumentTextIcon className="h-8 w-8 text-brand-secondary flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-brand-dark">{doc.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            <p className="text-xs text-gray-400 mt-2">Date: {doc.date}</p>
                        </div>
                    </div>
                </li>
              ))}
               {filteredDocuments.length === 0 && (
                <li className="text-center py-12 text-gray-500">
                  {searchTerm 
                    ? `No documents found for "${searchTerm}".`
                    : 'No documents found in this category.'
                  }
                </li>
              )}
            </ul>
            )}
          </div>
        </div>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl w-full h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark">{selectedDoc.title}</h2>
                    <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="h-7 w-7" />
                    </button>
                </header>
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-2/3 border-r">
                        <div className="w-full h-full flex flex-col">
                            <div className="p-2 bg-gray-100 text-sm border-b">
                                {selectedDoc.presignedUrl ? (
                                    <a href={selectedDoc.presignedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        Open PDF in new tab
                                    </a>
                                ) : (
                                    <span className="text-gray-600">Text Document</span>
                                )}
                            </div>
                            <div className="flex-1 overflow-auto p-4">
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {selectedDoc.content || 'No content available'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3 p-4">
                        <h3 className="text-lg font-semibold mb-4">Notes</h3>
                        <textarea
                            className="w-full h-full resize-none border rounded p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            placeholder="Write your notes here..."
                        />
                    </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default Library;