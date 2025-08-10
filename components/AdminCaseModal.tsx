import React, { useState, useEffect } from 'react';
import { ConsultancyCase } from '../types';
import XCircleIcon from './icons/XCircleIcon';
import PaperClipIcon from './icons/PaperClipIcon';
import UploadIcon from './icons/UploadIcon';

interface AdminCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseId: string, solution: string, fee: number, solutionFile: File | null) => void;
  caseToEdit: ConsultancyCase | null;
}

const AdminCaseModal: React.FC<AdminCaseModalProps> = ({ isOpen, onClose, onSubmit, caseToEdit }) => {
  const [solution, setSolution] = useState('');
  const [fee, setFee] = useState<number | ''>('');
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [solutionFileName, setSolutionFileName] = useState('');

  useEffect(() => {
    if (caseToEdit) {
      // Reset state each time a new case is opened
      setSolution(caseToEdit.solution || '');
      setFee(caseToEdit.fee || '');
      setSolutionFile(null);
      setSolutionFileName('');
    }
  }, [caseToEdit]);

  if (!isOpen || !caseToEdit) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSolutionFile(file);
        setSolutionFileName(file.name);
      } else {
        alert('Please upload a PDF file.');
        setSolutionFile(null);
        setSolutionFileName('');
        e.target.value = ''; // Clear the invalid file from input
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fee === '' || isNaN(Number(fee))) {
        alert("Please provide a valid fee.");
        return;
    }
    if (!solution.trim() && !solutionFile) {
        alert("Please provide a text solution or upload a solution PDF.");
        return;
    }
    onSubmit(caseToEdit.id, solution, Number(fee), solutionFile);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">Provide Solution for Case: {caseToEdit.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircleIcon className="h-7 w-7" />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <main className="p-6 space-y-6">
            <div>
                <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2">User Query</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">From: <span className="font-medium text-gray-700">{caseToEdit.userName} ({caseToEdit.userEmail})</span></p>
                    <p className="mt-4 text-gray-700 whitespace-pre-wrap">{caseToEdit.issue}</p>
                    {caseToEdit.documentName !== 'N/A' && (
                        <p className="text-sm text-gray-500 mt-3 flex items-center"><PaperClipIcon className="h-4 w-4 mr-2" />Attached: {caseToEdit.documentName}</p>
                    )}
                </div>
            </div>
            
            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700">Expert Solution (Text)</label>
              <textarea
                id="solution"
                name="solution"
                rows={6}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
                placeholder="Enter detailed text solution here, or leave blank if providing a PDF."
              />
            </div>
            
            <div>
              <label htmlFor="solution-pdf" className="block text-sm font-medium text-gray-700">Attach Solution PDF (optional)</label>
              <label htmlFor="solution-pdf-upload" className="relative cursor-pointer mt-1 bg-white rounded-md font-medium text-brand-secondary hover:text-brand-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-secondary">
                <div className="flex items-center space-x-4 px-4 py-3 border-2 border-gray-300 border-dashed rounded-md">
                    <UploadIcon className="h-10 w-10 text-gray-400" />
                    <div className="flex flex-col">
                        <span className="text-gray-700">Upload a PDF file as a solution</span>
                        <p className="text-xs text-gray-500">Only .pdf files are accepted</p>
                        {solutionFileName && <p className="text-sm text-green-600 mt-1">{solutionFileName}</p>}
                    </div>
                    <input id="solution-pdf-upload" name="solution-pdf-upload" type="file" accept="application/pdf" className="sr-only" onChange={handleFileChange} />
                </div>
              </label>
            </div>

            <div>
              <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Consultancy Fee (INR)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="fee"
                    name="fee"
                    value={fee}
                    onChange={(e) => setFee(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    min="0"
                    step="1"
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
                    placeholder="e.g., 500"
                  />
              </div>
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
              disabled={caseToEdit.status === 'COMPLETED'}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {caseToEdit.status === 'COMPLETED' ? 'Case Completed' : 'Save Solution & Fee'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AdminCaseModal;