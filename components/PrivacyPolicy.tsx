import React from 'react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-primary">Privacy Policy</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-600">Last Updated: 23-09-2025</p>
          <p className="text-gray-700">
            This Privacy Policy explains how cmmlr.co.in ("Website", "we", "our", "us") collects, uses, stores, and protects your personal information when you access or use our Website and services. By using this Website, you agree to the terms outlined here.
          </p>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">1. Information We Collect</h3>
            <p className="text-gray-700 mb-2">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li><strong>Personal Information:</strong> Name, email address, phone number, billing details, or other information you provide when contacting us, registering, or purchasing services.</li>
              <li><strong>Usage Data:</strong> Information about how you use the Website, such as IP address, browser type, pages visited, and time spent.</li>
              <li><strong>Payment Information:</strong> If you purchase services, payment details are processed securely through third-party payment providers. We do not store full credit/debit card details.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">2. How We Use Your Information</h3>
            <p className="text-gray-700 mb-2">We may use collected information to:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Provide and improve our services.</li>
              <li>Process payments and subscriptions.</li>
              <li>Respond to inquiries and customer support requests.</li>
              <li>Send important updates, notices, or promotional content (with your consent).</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">3. Data Sharing & Disclosure</h3>
            <p className="text-gray-700 mb-2">We do not sell or trade your personal data. However, we may share information with:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Trusted service providers (e.g., payment processors, hosting providers) to facilitate services.</li>
              <li>Legal authorities, if required by law, court order, or government request.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">4. Data Security</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>We use industry-standard measures to protect your data from unauthorized access, alteration, or disclosure.</li>
              <li>However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">5. Cookies & Tracking Technologies</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Our Website may use cookies and similar technologies to enhance user experience, analyze traffic, and provide personalized content.</li>
              <li>You can choose to disable cookies in your browser settings, but some features may not work properly.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">6. Data Retention</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>We retain personal data only as long as necessary for providing services, complying with legal requirements, or resolving disputes.</li>
              <li>You may request deletion of your personal data by contacting us (see Section 9).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">7. Third-Party Links</h3>
            <p className="text-gray-700">Our Website may contain links to external websites. We are not responsible for the privacy practices or content of third-party websites.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">8. Your Rights</h3>
            <p className="text-gray-700 mb-2">Depending on applicable law (including the Indian IT Act, 2000), you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Access and review your personal data.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Opt out of receiving promotional communications.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">9. Contact Us</h3>
            <p className="text-gray-700 mb-2">For questions, concerns, or requests related to this Privacy Policy, please contact us:</p>
            <div className="text-gray-700 space-y-1">
              <p>Website: https://www.cmmlr.co.in</p>
              <p>Email: rajshekhar.it@gmail.com</p>
              <p>Phone: +917091627631</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">10. Changes to this Policy</h3>
            <p className="text-gray-700">We may update this Privacy Policy from time to time. Changes will be posted on this page with the revised date. Please review this page periodically for updates.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;