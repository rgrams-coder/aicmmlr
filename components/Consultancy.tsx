import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ConsultancyCase, ConsultancyStatus, UserData } from '../types';
import PaperClipIcon from './icons/PaperClipIcon';
import XCircleIcon from './icons/XCircleIcon';
import BanknotesIcon from './icons/BanknotesIcon';
import UploadIcon from './icons/UploadIcon';

interface ConsultancyProps {
  cases: ConsultancyCase[];
  userData: UserData;
  onBackToDashboard: () => void;
  onSubmit: (data: { issue: string; document: File | null }) => void;
  onPay: (caseId: string) => void;
}

const statusStyles: { [key: string]: string } = {
  'open': 'bg-yellow-100 text-yellow-800',
  'in_progress': 'bg-blue-100 text-blue-800',
  'closed': 'bg-green-100 text-green-800',
};

const statusText: { [key: string]: string } = {
  'open': 'Open',
  'in_progress': 'In Progress',
  'closed': 'Closed',
}

const Consultancy: React.FC<ConsultancyProps> = ({ cases: initialCases, userData, onBackToDashboard, onSubmit, onPay }) => {
  const [cases, setCases] = useState<ConsultancyCase[]>(initialCases);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const response = await apiService.getCases();
        setCases(response.cases);
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);
  const [issue, setIssue] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [selectedCase, setSelectedCase] = useState<ConsultancyCase | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocument(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;
    setIsSubmitting(true);
    try {
      await apiService.createCase({ issue });
      const response = await apiService.getCases();
      setCases(response.cases);
      setIssue('');
      setDocument(null);
      setFileName('');
    } catch (error) {
      alert('Failed to submit case');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePayForSolution = (caseToPay: ConsultancyCase) => {
    if (!caseToPay.fee) {
        alert("Fee information is not available for this case.");
        return;
    }

    const options = {
        key: 'rzp_test_VWCS3cXessJ8LA',
        amount: caseToPay.fee * 100, // Amount in paise
        currency: "INR",
        name: "Mines and Minerals - Consultancy Fee",
        description: `Payment for case #${caseToPay.id}`,
        handler: (response: any) => {
            console.log('Case payment successful:', response);
            onPay(caseToPay.id);
            setSelectedCase(prev => prev ? { ...prev, isPaid: true, status: ConsultancyStatus.COMPLETED } : null);
        },
        prefill: {
            name: userData.name,
            email: userData.email,
            contact: userData.phone,
        },
        theme: {
            color: "#1a3b5d",
        },
        modal: {
            ondismiss: () => {
              console.log('Razorpay modal dismissed for case payment.');
            }
        }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.on('payment.failed', function (response: any){
        alert(`Payment failed: ${response.error.description}`);
        console.error(response.error);
    });
    razorpay.open();
  };

  const handleViewDetails = (caseToShow: ConsultancyCase) => {
    setSelectedCase(caseToShow);
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <header className="bg-brand-dark p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Consultancy Services</h1>
              <button onClick={onBackToDashboard} className="text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary px-4 py-2 rounded-md transition-colors">
                Back to Dashboard
              </button>
            </div>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[70vh]">
            <aside className="lg:col-span-2 p-6 bg-brand-light border-b lg:border-r lg:border-b-0 border-gray-200">
                <h2 className="text-xl font-bold text-brand-dark mb-4">Submit a New Query</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="issue" className="block text-sm font-medium text-gray-700">Describe your issue</label>
                        <textarea id="issue" name="issue" rows={6} value={issue} onChange={(e) => setIssue(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary shadow-sm" placeholder="Please provide as much detail as possible..."></textarea>
                    </div>
                    <div>
                        <label htmlFor="document-upload" className="block text-sm font-medium text-gray-700">Attach a document (optional)</label>
                        <label className="relative mt-1 flex justify-center items-center w-full h-20 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-secondary">
                             <div className="flex items-center space-x-2 text-gray-600">
                                <PaperClipIcon className="h-6 w-6"/>
                                <span className="font-medium">{fileName || "Upload a file (PDF, DOCX)"}</span>
                             </div>
                            <input id="document-upload" name="document-upload" type="file" className="sr-only" onChange={handleFileChange} />
                        </label>
                    </div>
                    <button type="submit" disabled={!issue.trim() || isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                        {isSubmitting ? 'Submitting...' : 'Submit for Expert Review'}
                    </button>
                </form>
            </aside>
            <main className="lg:col-span-3 p-6">
                 <h2 className="text-xl font-bold text-brand-dark mb-4">Your Case History</h2>
                 {cases.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <p>You have no open or past cases.</p>
                        <p className="text-sm">Use the form on the left to submit your first query.</p>
                    </div>
                 ) : (
                    <ul className="space-y-3">
                        {cases.map(c => (
                            <li key={c.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-brand-dark">{c.caseRefNo || c.id}</p>
                                        <p className="text-sm text-gray-600 truncate">Issue: {c.issue}</p>
                                        <p className="text-sm text-gray-500">Submitted: {new Date(c.createdAt || c.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[c.status]}`}>{statusText[c.status]}</span>
                                        <button onClick={() => handleViewDetails(c)} className="text-sm font-medium text-brand-secondary hover:text-brand-primary">View Details</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                 )}
            </main>
          </div>
        </div>
      </div>

      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-brand-dark">Case Details: {selectedCase.caseRefNo || selectedCase.id}</h2>
                    <button onClick={() => setSelectedCase(null)} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="h-7 w-7" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2">Your Query</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{selectedCase.issue}</p>
                            {selectedCase.document && (
                                <p className="text-sm text-gray-500 mt-3 flex items-center">
                                    <PaperClipIcon className="h-4 w-4 mr-2" />
                                    <a href={selectedCase.documentUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                                        Attached: {selectedCase.document}
                                    </a>
                                </p>
                            )}
                        </div>
                         <div>
                            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2">Expert's Solution</h3>
                            {selectedCase.status === ConsultancyStatus.PENDING && (
                                <p className="text-gray-600 p-4 bg-yellow-50 rounded-md">Your query is currently under review by our experts. You will be notified when the solution is ready.</p>
                            )}
                            {selectedCase.status !== ConsultancyStatus.PENDING && !selectedCase.isPaid && (
                                <div className="text-center p-6 bg-blue-50 rounded-md">
                                    <h4 className="font-bold text-brand-dark">A solution is ready for you!</h4>
                                    <p className="text-gray-600 my-2">Please complete the secure payment to unlock the expert's advice.</p>
                                    <p className="font-bold text-xl text-brand-dark my-4">Fee: ₹{selectedCase.fee?.toLocaleString() || 'N/A'}</p>
                                    <button 
                                      onClick={() => handlePayForSolution(selectedCase)} 
                                      className="inline-flex items-center gap-2 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
                                      disabled={!selectedCase.fee}
                                    >
                                        <BanknotesIcon className="h-5 w-5"/>
                                        Pay ₹{selectedCase.fee?.toLocaleString()} and View Solution
                                    </button>
                                </div>
                            )}
                            {selectedCase.isPaid && (
                                <div className="p-4 bg-green-50 rounded-md space-y-4">
                                    {selectedCase.solution && (
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-800">Text Solution:</h4>
                                            <p className="text-gray-700 whitespace-pre-wrap mt-1">{selectedCase.solution}</p>
                                        </div>
                                    )}
                                    {selectedCase.solutionDocumentName && (
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-800">Attached Solution Document:</h4>
                                            <a 
                                                href="#" 
                                                onClick={(e) => { e.preventDefault(); alert(`Downloading ${selectedCase.solutionDocumentName}... (This is a simulation)`); }}
                                                className="flex items-center gap-2 text-brand-secondary hover:underline mt-1"
                                                title={`Download ${selectedCase.solutionDocumentName}`}
                                            >
                                                <PaperClipIcon className="h-5 w-5"/>
                                                <span>{selectedCase.solutionDocumentName}</span>
                                            </a>
                                        </div>
                                    )}
                                    {!selectedCase.solution && !selectedCase.solutionDocumentName && (
                                        <p className="text-gray-700">The solution has been processed. If you believe this is an error, please contact support.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
      )}
    </>
  );
};

export default Consultancy;