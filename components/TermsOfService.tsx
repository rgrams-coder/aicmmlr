import React from 'react';

interface TermsOfServiceProps {
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-primary">Terms and Conditions</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-600">Last Updated: 23-09-2025</p>
          <p className="text-gray-700">
            Welcome to cmmlr.co.in ("Website", "we", "our", "us"). By accessing or using this Website, you ("you", "your", "user", "visitor", "client") agree to comply with and be bound by the following Terms and Conditions ("Terms"). If you do not agree with these Terms, please do not use this Website.
          </p>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-700">By accessing or using cmmlr.co.in, you agree to these Terms, our Privacy Policy, and any additional guidelines or rules applicable to specific services or sections of the Website.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">2. Services Provided</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>cmmlr.co.in provides information, consultancy, resources, and updates related to mines and minerals, sand auction, legal consultancy. The Website may include articles, notices, updates, and paid or free services.</li>
              <li>We reserve the right to modify, suspend, or discontinue any service without prior notice.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">3. User Obligations</h3>
            <p className="text-gray-700 mb-2">When using this Website, you agree:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>To provide accurate and truthful information when registering or submitting inquiries.</li>
              <li>Not to misuse the Website for unlawful activities.</li>
              <li>Not to upload or distribute harmful material (viruses, malware, offensive content).</li>
              <li>To respect intellectual property rights related to Website content.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">4. Intellectual Property Rights</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Unless otherwise stated, all content on cmmlr.co.in, including text, graphics, logos, images, documents, and software, is the property of the CMMLR Team.</li>
              <li>You may not copy, reproduce, republish, or distribute Website content without written permission.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">5. Disclaimers</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>The information provided on cmmlr.co.in is for general informational and consultancy purposes only and should not be considered as legal, financial, or professional advice.</li>
              <li>We make no warranties regarding the completeness, reliability, or accuracy of the information.</li>
              <li>Your use of this Website is at your own risk.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">6. Limitation of Liability</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>We shall not be held liable for any direct, indirect, incidental, or consequential damages arising from your use of this Website or reliance on its content.</li>
              <li>We are not responsible for external links or third-party services accessed via cmml.co.in.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">7. Payments & Subscriptions (If Applicable)</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Paid services, subscriptions, or consultancy fees (if any) must be made through the approved payment methods displayed on the Website.</li>
              <li>Once a payment is processed, it may be non-refundable, unless otherwise stated under our Refund Policy.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">8. Refund Policy</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Fees paid for consultancy, subscriptions, or services are generally non-refundable, unless a technical error or double payment occurs.</li>
              <li>Any refund requests must be submitted within 7 days of payment with valid proof.</li>
              <li>Refunds, if approved, will be processed to the original payment method within 7–14 business days.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">9. Data Usage Disclaimer</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>By using our Website, you consent to the collection and use of your data as per our Privacy Policy.</li>
              <li>User data may be stored, processed, and used to improve services, comply with legal requirements, and provide consultancy support.</li>
              <li>We do not sell or trade your personal data to third parties.</li>
              <li>However, we may share data with trusted service providers or government authorities if legally required.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">10. Professional Liability Clause</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>cmmlr.co.in provides consultancy and information services in good faith.</li>
              <li>We are not liable for losses, damages, or disputes that may arise from decisions made by clients based on Website content or consultancy advice.</li>
              <li>Users are advised to seek independent professional or legal advice before making critical decisions.</li>
              <li>Our liability, if any, is strictly limited to the fees paid for the specific service in question.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">11. Privacy Policy</h3>
            <p className="text-gray-700">Your use of cmmlr.co.in is also governed by our Privacy Policy, which explains how we collect, store, and use user data.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">12. Termination</h3>
            <p className="text-gray-700">We reserve the right to suspend or terminate your access to the Website if you violate these Terms or engage in unlawful behavior.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">13. Governing Law & Jurisdiction</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>These Terms are governed by the laws of India.</li>
              <li>Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Ranchi, Jharkhand.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">14. Changes to Terms</h3>
            <p className="text-gray-700">We may update or revise these Terms at any time without prior notice. Updated Terms will be posted on this page with the revised date.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-brand-primary mb-3">15. Contact Us</h3>
            <p className="text-gray-700 mb-2">For questions or concerns regarding these Terms, please contact us:</p>
            <div className="text-gray-700 space-y-1">
              <p>Website: https://www.cmmlr.co.in</p>
              <p>Email: rajshekhar.it@gmail.com</p>
              <p>Phone: +917091627631</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;