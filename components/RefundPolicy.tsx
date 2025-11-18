import React from 'react';

interface RefundPolicyProps {
  onClose: () => void;
}

const RefundPolicy: React.FC<RefundPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-primary">Refund Policy</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-600">Last Updated: 23-09-2025</p>
          <p className="text-gray-700">
            At cmmlr.co.in, we aim to provide transparent and reliable consultancy and services. This Refund Policy outlines the conditions under which payments may be refunded.
          </p>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">1. General Policy</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>All payments made for consultancy, subscriptions, or services on cmml.co.in are generally non-refundable.</li>
              <li>A refund will only be issued in specific cases mentioned below.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">2. Eligible Refund Cases</h3>
            <p className="text-gray-700 mb-2">Refunds may be approved under the following circumstances:</p>
            <ol className="list-decimal pl-6 space-y-1 text-gray-700">
              <li><strong>Duplicate Payment</strong> – If you are charged more than once for the same service.</li>
              <li><strong>Technical Error</strong> – If a payment is processed due to a technical glitch or system error.</li>
              <li><strong>Service Non-Delivery</strong> – If you have paid for a service that was not provided within the agreed timeline, subject to verification.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">3. Non-Refundable Cases</h3>
            <p className="text-gray-700 mb-2">Refunds will not be issued for:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Consultancy or advisory services already delivered.</li>
              <li>Subscription or membership fees once the access has been granted.</li>
              <li>User dissatisfaction based on personal expectations or decisions taken based on consultancy advice.</li>
              <li>Any case where service has been provided in part or full.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">4. Refund Request Procedure</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>To request a refund, please contact us at rajshekhar.it@gmail.com within 7 days of the payment date.</li>
              <li>You must provide:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Payment reference number/transaction ID</li>
                  <li>Proof of payment</li>
                  <li>Reason for refund request</li>
                </ul>
              </li>
              <li>Our team will review and respond within 5–7 business days.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">5. Refund Processing</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Approved refunds will be processed to the original method of payment (credit/debit card, UPI, net banking, etc.).</li>
              <li>Refunds may take 7–14 business days to reflect in your account, depending on your payment provider.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">6. Contact Us</h3>
            <p className="text-gray-700 mb-2">If you have any questions about our Refund Policy, please contact us:</p>
            <div className="text-gray-700 space-y-1">
              <p>Website: https://www.cmmlr.co.in</p>
              <p>Email: rajshekhar.it@gmail.com</p>
              <p>Phone: 7091627631</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;