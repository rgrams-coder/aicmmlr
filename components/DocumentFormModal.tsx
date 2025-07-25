
import React, { useState, useEffect } from 'react';
import { LibraryDocument, DocumentType } from '../types';
import XCircleIcon from './icons/XCircleIcon';

const DOCUMENT_TYPES_META = [
    { key: DocumentType.BARE_ACT, label: 'Bare Act' },
    { key: DocumentType.NOTIFICATION, label: 'Notification' },
    { key: DocumentType.CIRCULAR, label: 'Circular' },
    { key: DocumentType.GOVERNMENT_ORDER, label: 'Govt. Order' },
    { key: DocumentType.JUDGEMENT, label: 'Judgement' },
];


interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (doc: LibraryDocument) => void;
  documentToEdit?: LibraryDocument | null;
  initialType: DocumentType;
}

const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  documentToEdit,
  initialType,
}) => {
  const getInitialState = () => ({
    id: documentToEdit?.id || `doc-${Date.now()}`,
    type: documentToEdit?.type || initialType,
    title: documentToEdit?.title || '',
    description: documentToEdit?.description || '',
    date: documentToEdit?.date || new Date().toISOString().split('T')[0],
    content: documentToEdit?.content || '',
  });

  const [formData, setFormData] = useState<LibraryDocument>(getInitialState());

  useEffect(() => {
    if (isOpen) {
        setFormData(getInitialState());
    }
  }, [documentToEdit, initialType, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">
            {documentToEdit ? 'Edit Document' : 'Add New Document'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircleIcon className="h-7 w-7" />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <main className="p-6 space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Document Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-100 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm rounded-md"
              >
                {DOCUMENT_TYPES_META.map(type => (
                  <option key={type.key} value={type.key}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                id="content"
                name="content"
                rows={8}
                value={formData.content}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
                placeholder="Enter the full content of the document here."
              />
            </div>
          </main>
          <footer className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary"
            >
              {documentToEdit ? 'Save Changes' : 'Add Document'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default DocumentFormModal;
