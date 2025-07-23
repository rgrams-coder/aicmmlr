import React, { useState, useMemo } from 'react';
import { DocumentType, LibraryDocument } from '../types';
import { LIBRARY_DATA } from '../constants';
import DocumentTextIcon from './icons/DocumentTextIcon';
import XCircleIcon from './icons/XCircleIcon';
import SearchIcon from './icons/SearchIcon';

interface LibraryProps {
  onBackToDashboard: () => void;
}

const DOCUMENT_TYPES = [
  { key: DocumentType.BARE_ACT, label: 'Bare Acts' },
  { key: DocumentType.NOTIFICATION, label: 'Notifications' },
  { key: DocumentType.CIRCULAR, label: 'Circulars' },
  { key: DocumentType.GOVERNMENT_ORDER, label: 'Govt. Orders' },
  { key: DocumentType.JUDGEMENT, label: 'Judgements' },
];

const Library: React.FC<LibraryProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<DocumentType>(DocumentType.BARE_ACT);
  const [selectedDoc, setSelectedDoc] = useState<LibraryDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return LIBRARY_DATA.filter(doc => {
        const matchesCategory = doc.type === activeTab;
        if (!matchesCategory) return false;

        if (!lowercasedSearchTerm) return true;

        const matchesTitle = doc.title.toLowerCase().includes(lowercasedSearchTerm);
        const matchesDescription = doc.description.toLowerCase().includes(lowercasedSearchTerm);
        return matchesTitle || matchesDescription;
    });
  }, [activeTab, searchTerm]);

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
            <ul className="space-y-4">
              {filteredDocuments.map(doc => (
                 <li key={doc.id} onClick={() => setSelectedDoc(doc)} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
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
          </div>
        </div>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark">{selectedDoc.title}</h2>
                    <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="h-7 w-7" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedDoc.content}</p>
                </main>
                 <footer className="p-3 bg-gray-50 text-right text-xs text-gray-500 border-t">
                    Content is for viewing only. Downloading and printing are disabled.
                </footer>
            </div>
        </div>
      )}
    </>
  );
};

export default Library;
