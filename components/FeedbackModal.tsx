import React, { useState } from 'react';

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    if (feedback.trim()) {
      try {
        const { apiService } = await import('../services/api');
        await apiService.submitFeedback({ feedbackText: feedback });
        onSubmit(feedback);
      } catch (error) {
        alert('Failed to submit feedback. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Submit Feedback</h3>
          <div className="mt-2 px-7 py-3">
            <textarea
              className="w-full h-32 px-3 py-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-brand-primary text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
              Submit
            </button>
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;