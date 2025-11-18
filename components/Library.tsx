
import React, { useState, useMemo, useEffect } from 'react';
import { apiService } from '../services/api';
import { DocumentType, LibraryDocument, Note } from '../types';
import DocumentTextIcon from './icons/DocumentTextIcon';
import XCircleIcon from './icons/XCircleIcon';
import SearchIcon from './icons/SearchIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import FolderIcon from './icons/FolderIcon';

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
  const [activeCategory, setActiveCategory] = useState<DocumentType>(DocumentType.BARE_ACT);
  const [selectedDoc, setSelectedDoc] = useState<LibraryDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<{[key: string]: string}>({});
  const [noteTitles, setNoteTitles] = useState<{[key: string]: string}>({});
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [hasLibraryAccess, setHasLibraryAccess] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [isTrialActive, setIsTrialActive] = useState(false);

  useEffect(() => {
    const fetchLibraryData = async () => {
      setLoading(true);
      try {
        // Check library access first
        const accessResponse = await apiService.checkLibraryAccess();
        setHasLibraryAccess(accessResponse.hasLibraryAccess);
        setIsTrialActive(accessResponse.isTrialActive);
        setTrialDaysLeft(accessResponse.trialDaysLeft);
        
        // Only fetch documents if user has access
        if (accessResponse.hasLibraryAccess) {
          const documentsResponse = await apiService.getDocuments();
          setDocuments(documentsResponse.documents);
        }
      } catch (error) {
        console.error('Failed to fetch library data:', error);
        // Set access to false on error
        setHasLibraryAccess(false);
        
        // Still get trial info from local storage for display
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const trialStart = new Date(user.trialStartDate || user.createdAt);
        const now = new Date();
        const daysSinceStart = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, 2 - daysSinceStart);
        setTrialDaysLeft(daysLeft);
        setIsTrialActive(daysLeft > 0 && !user.trialUsed);
      } finally {
        setLoading(false);
      }
    };
    fetchLibraryData();
  }, []);

  const documentsByCategory = useMemo(() => {
    const categorized = DOCUMENT_TYPES.reduce((acc, type) => {
      acc[type.key] = documents.filter(doc => doc.type === type.key);
      return acc;
    }, {} as Record<DocumentType, LibraryDocument[]>);
    return categorized;
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const categoryDocs = documentsByCategory[activeCategory] || [];
    if (!searchTerm) return categoryDocs;
    
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return categoryDocs.filter(doc => 
      doc.title.toLowerCase().includes(lowercasedSearchTerm) ||
      doc.description.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [activeCategory, searchTerm, documentsByCategory]);

  const handleNoteChange = (docId: string, note: string) => {
    setNotes(prev => ({ ...prev, [docId]: note }));
  };

  const handleNoteTitleChange = (docId: string, title: string) => {
    setNoteTitles(prev => ({ ...prev, [docId]: title }));
  };

  const handleSaveNote = async (docId: string) => {
    const noteContent = notes[docId];
    const noteTitle = noteTitles[docId];
    
    if (!noteTitle?.trim()) {
      alert('Please enter a title for your note');
      return;
    }
    
    if (!noteContent?.trim()) {
      alert('Please enter note content before saving');
      return;
    }

    try {
      await apiService.createNote({
        title: noteTitle,
        content: noteContent,
        documentId: docId
      });
      alert('Note saved successfully!');
      setNotes(prev => ({ ...prev, [docId]: '' }));
      setNoteTitles(prev => ({ ...prev, [docId]: '' }));
    } catch (error) {
      alert('Failed to save note');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-brand-dark p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Digital Library Dashboard</h1>
            {isTrialActive && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Trial Active: {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left
              </span>
            )}
          </div>
          <button
            onClick={onBackToDashboard}
            className="text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary px-4 py-2 rounded-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {!hasLibraryAccess ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <BookOpenIcon className="h-24 w-24 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium mb-4 text-gray-800">Library Access Requires Subscription</h3>
            <p className="text-gray-600 mb-6">
              {isTrialActive 
                ? 'Digital Library access requires a subscription and is not included in the trial period. Subscribe now to access our comprehensive legal document collection.'
                : 'Subscribe to access our comprehensive digital library of legal documents and resources.'
              }
            </p>
            <button
              onClick={onBackToDashboard}
              className="bg-brand-secondary text-white px-6 py-3 rounded-md hover:bg-brand-primary transition-colors"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      ) : (
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Categories and Documents */}
        <div className="w-1/5 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Category</h2>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as DocumentType)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
              >
                {DOCUMENT_TYPES.map(category => {
                  const count = documentsByCategory[category.key]?.length || 0;
                  return (
                    <option key={category.key} value={category.key}>
                      {category.label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Documents List */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                {DOCUMENT_TYPES.find(t => t.key === activeCategory)?.label}
                {searchTerm && ` (Search: "${searchTerm}")`}
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-secondary mx-auto"></div>
                  <p className="text-gray-500 mt-2 text-sm">Loading...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredDocuments.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedDoc?.id === doc.id
                          ? 'bg-brand-light border-brand-secondary'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <DocumentTextIcon className="h-5 w-5 text-brand-secondary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{doc.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{doc.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{doc.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">
                        {searchTerm 
                          ? `No documents found for "${searchTerm}"`
                          : 'No documents in this category'
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {selectedDoc ? (
            <>
              {/* Document Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedDoc.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedDoc.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Date: {selectedDoc.date}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Document Viewer */}
                <div className="flex-1 bg-gray-100">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                      {selectedDoc.presignedUrl ? (
                        <div className="w-full h-full flex flex-col">
                          <div className="flex-1 bg-gray-100">
                            <iframe
                              src={selectedDoc.presignedUrl}
                              className="w-full h-full border-0"
                              title={selectedDoc.title}
                              onError={() => {
                                const iframe = document.querySelector('iframe');
                                if (iframe) {
                                  iframe.style.display = 'none';
                                  const errorDiv = document.createElement('div');
                                  errorDiv.className = 'flex items-center justify-center h-full text-gray-500';
                                  errorDiv.innerHTML = `
                                    <div class="text-center">
                                      <svg class="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                      </svg>
                                      <p class="text-lg font-medium mb-2">Document Not Available</p>
                                      <p class="text-sm">This document file is missing or corrupted.</p>
                                    </div>
                                  `;
                                  iframe.parentNode?.appendChild(errorDiv);
                                }
                              }}
                            />
                          </div>
                          <div className="p-2 bg-gray-100 border-t text-center">
                            <a
                              href={selectedDoc.presignedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-secondary hover:text-brand-primary text-sm font-medium mr-4"
                            >
                              Open Direct Link
                            </a>
                            <a
                              href={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedDoc.presignedUrl)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-secondary hover:text-brand-primary text-sm font-medium mr-4"
                            >
                              Google Viewer
                            </a>
                            <a
                              href={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(selectedDoc.presignedUrl)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-secondary hover:text-brand-primary text-sm font-medium"
                            >
                              PDF.js Viewer
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p>No content available for this document</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes Panel */}
                <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
                  </div>
                  <div className="flex-1 p-4 flex flex-col space-y-3">
                    <input
                      type="text"
                      value={noteTitles[selectedDoc.id] || ''}
                      onChange={(e) => handleNoteTitleChange(selectedDoc.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
                      placeholder="Enter note title..."
                    />
                    <textarea
                      value={notes[selectedDoc.id] || ''}
                      onChange={(e) => handleNoteChange(selectedDoc.id, e.target.value)}
                      className="flex-1 resize-none border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
                      placeholder="Write your notes about this document..."
                    />
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button 
                      onClick={() => handleSaveNote(selectedDoc.id)}
                      className="w-full bg-brand-secondary text-white py-2 px-4 rounded-md hover:bg-brand-primary transition-colors text-sm"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <BookOpenIcon className="h-24 w-24 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-medium mb-2">Select a Document</h3>
                <p>Choose a document from the left panel to view its content and add notes</p>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default Library;