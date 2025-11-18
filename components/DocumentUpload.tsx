import React, { useState } from 'react';
// Direct import to avoid package resolution issues
const FileUploadProvider = ({ children, config }: any) => {
  return (
    <div data-config={JSON.stringify(config)}>
      {children}
    </div>
  );
};

const useFileUpload = () => {
  return {
    config: { apiUrl: '', categories: [] }
  };
};
import { LibraryDocument, DocumentType } from '../types';
import { API_CONFIG } from '../config';

const DOCUMENT_TYPES_META = [
    { key: DocumentType.BARE_ACT, label: 'Bare Act' },
    { key: DocumentType.NOTIFICATION, label: 'Notification' },
    { key: DocumentType.CIRCULAR, label: 'Circular' },
    { key: DocumentType.GOVERNMENT_ORDER, label: 'Govt. Order' },
    { key: DocumentType.JUDGEMENT, label: 'Judgement' },
];

interface DocumentUploadProps {
  onFileUploaded: (doc: LibraryDocument) => void;
  initialType: DocumentType;
}

const DocumentUploadForm: React.FC<DocumentUploadProps> = ({ onFileUploaded, initialType }) => {
  const config = {
    apiUrl: API_CONFIG.API_BASE_URL,
    categories: ['bare-act', 'notification', 'circular', 'government-order', 'judgement']
  };
  const [formData, setFormData] = useState({
    type: initialType,
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.title || !formData.description) return;

    setUploading(true);
    try {
      // Create FormData for file upload with all document data
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', formData.type);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('date', formData.date);
      
      // Get auth token
      const token = localStorage.getItem('token');
      
      // Upload document using the integrated endpoint
      const response = await fetch(`${config.apiUrl}/documents/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: uploadFormData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const result = await response.json();
      
      const document: LibraryDocument = {
        id: result.document?._id || result.document?.id || `doc-${Date.now()}`,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        content: result.document?.fileUrl || '',
      };

      onFileUploaded(document);
      
      // Reset form
      setFormData({
        type: initialType,
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">PDF Document</label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          accept=".pdf"
          required
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
        />
        {file && <p className="text-sm text-gray-500 mt-1">Selected: {file.name}</p>}
      </div>
      
      <button
        type="submit"
        disabled={uploading || !file || !formData.title || !formData.description}
        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </form>
  );
};

const DocumentUpload: React.FC<DocumentUploadProps> = (props) => {
  return <DocumentUploadForm {...props} />;
};

export default DocumentUpload;