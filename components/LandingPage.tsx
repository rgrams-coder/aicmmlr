
import React, { useState, forwardRef } from 'react';
import MiningIcon from './icons/MiningIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UsersIcon from './icons/UsersIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import RefundPolicy from './RefundPolicy';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onContactSubmit: (formData: { name: string; email: string; message: string }) => void;
}

interface LandingPageHandles {
  contactRef: React.RefObject<HTMLDivElement>;
  faqRef: React.RefObject<HTMLDivElement>;
}

const LandingPage = forwardRef<LandingPageHandles, LandingPageProps>(({ onGetStarted, onLoginClick, onContactSubmit }, ref) => {
  const internalRef = React.useRef<HTMLDivElement>(null);
  const { contactRef, faqRef } = (ref as React.RefObject<LandingPageHandles>)?.current || { contactRef: internalRef, faqRef: internalRef };

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);

  const faqData = [
    {
      question: 'What is the Mines and Minerals Law Ecosystem?',
      answer: 'The Mines and Minerals Law Ecosystem is a comprehensive web platform designed to support students, researchers, government officials, mineral dealers, lessees, firms, and companies with curated resources, legal tools, and a digital library focused on mining and mineral laws.',
    },
    {
      question: 'Who can register on this platform?',
      answer: 'The following categories of users can register: Students, Researchers, Others (Govt/PSU), Mineral Dealers, Firms and Lessees, and Companies.',
    },
    {
      question: 'What are the registration fees?',
      answer: 'Registration is mandatory for accessing the services and is a one-time fee for maintaining the site: Students & Researchers: ₹1,000, Officials, Mineral Dealers, Firms & Lessees: ₹5,000, Companies: ₹15,000.',
    },
    {
      question: 'What services are included with registration?',
      answer: 'Registration gives access to: Legal updates and policy changes, Case law summaries, Regulatory guidance, Notifications and circulars. Note: Access to the digital Library requires an additional annual subscription.',
    },
    {
      question: 'What are the charges for Library access?',
      answer: 'The library contains premium materials such as full legal texts, analysis, archived documents, and exclusive research reports. Annual fees: Students: ₹5,000, Researchers: ₹7,000, Officials, Mineral Dealers, Firms & Lessees: ₹15,000, Companies: ₹25,000.',
    },
    {
      question: 'Can I access the platform without paying the Library fee?',
      answer: 'Yes. You can still benefit from several core features such as legal updates, forums, and basic guidance with only the registration fee. However, the library content is only accessible after subscribing to the respective annual library access plan.',
    },
    {
      question: 'Is the payment secure?',
      answer: 'Yes, we use secure payment gateways to ensure your transactions are protected.',
    },
    {
      question: 'Can I upgrade my account or switch categories?',
      answer: 'Yes, you can request an upgrade or switch category by contacting our support team. Additional fees may apply based on your new category.',
    },
    {
      question: 'How do I get support if I face any issues?',
      answer: 'You can reach our support team via Email: rajshekhar.it@gmail.com or Phone: +917091627631.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Fees are non-refundable once paid, as we provide immediate access to digital services and resources. Please ensure you choose the correct category before registering.',
    },
  ];

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { apiService } = await import('../services/api');
      await apiService.submitContact(contactForm);
      alert('Thank you for your message! We will get back to you soon.');
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    }
  };

  const features = [
    {
      icon: <BookOpenIcon className="h-10 w-10 text-brand-accent" />,
      title: 'Comprehensive Digital Library',
      description: 'Access an exhaustive collection of Bare Acts, notifications, circulars, and landmark judgements, all updated and easily searchable.',
    },
    {
      icon: <BriefcaseIcon className="h-10 w-10 text-brand-accent" />,
      title: 'Expert Consultancy',
      description: 'Connect with seasoned legal professionals for tailored advice on your specific mining-related legal issues. (Premium feature)',
    },
    {
      icon: <UsersIcon className="h-10 w-10 text-brand-accent" />,
      title: 'Tailored For You',
      description: 'Whether you\'re a mineral dealer, a student, or others, our platform provides features relevant to your role.',
    },
  ];

  return (
    <div className="w-full animate-fade-in text-brand-dark">
        <main>
            {/* Hero Section */}
            <section
                className="bg-brand-primary rounded-xl shadow-2xl p-8 md:py-20 md:px-12 text-center"
            >
                <div className="max-w-4xl mx-auto">
                    <MiningIcon className="w-20 h-20 text-brand-accent mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        Navigating Mining Law, Simplified.
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-light">
                        Your all-in-one platform for legal resources, expert consultancy, and industry compliance in the mines and minerals sector.
                    </p>
                    <div className="mt-8 flex justify-center items-center space-x-4">
                        <button
                            onClick={onGetStarted}
                            className="px-8 py-3 border border-transparent text-base font-semibold rounded-md text-brand-dark bg-brand-accent hover:opacity-90 transform hover:scale-105 transition-all"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={onLoginClick}
                            className="px-8 py-3 border-2 border-brand-light text-base font-medium rounded-md text-brand-light hover:bg-brand-light hover:text-brand-dark transition-colors"
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </section>

            {/* Disclaimer Section */}
            <section className="py-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 font-medium">
                            Thank You for visiting the site. Currently, we are providing the service in relation to JMMC rules 2004 and rules connected therewith. Likely to be extended for other states. 
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 md:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">A Comprehensive Mines and Minerals Laws Ecosystem</h2>
                        <p className="text-md text-gray-600 mt-2">Everything you need, all in one place.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-brand-light mx-auto mb-5">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Who it's for Section */}
            <section className="bg-white rounded-xl shadow-2xl p-8 md:p-12">
                 <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold">Designed for Every Role in the Industry</h2>
                     <p className="text-md text-gray-600 mt-2 mb-6">We cater to the unique needs of various professionals and academics.</p>
                     <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                        <span className="bg-brand-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">Mineral Dealers</span>
                        <span className="bg-brand-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">Lessees</span>
                        <span className="bg-brand-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">Others </span>
                        <span className="bg-brand-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">Firms & Companies</span>
                        <span className="bg-brand-accent text-brand-dark px-4 py-1 rounded-full text-sm font-semibold">Students</span>
                        <span className="bg-brand-accent text-brand-dark px-4 py-1 rounded-full text-sm font-semibold">Researchers</span>
                    </div>
                 </div>
            </section>

            {/* Contact Us Section */}
                        {/* FAQ Section */}
            <section ref={faqRef} className="py-12 md:py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                        <p className="text-md text-gray-600 mt-2">Find answers to common questions about our platform.</p>
                    </div>
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <button
                                    className="w-full flex justify-between items-center p-5 text-left font-semibold text-brand-dark focus:outline-none"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <span>{faq.question}</span>
                                    <span className={`transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </span>
                                </button>
                                <div className={`transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                                    <div className="p-5 pt-0 text-gray-600">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section ref={contactRef} className="py-12 md:py-20 bg-brand-light">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold">Get in Touch</h2>
                    <p className="text-md text-gray-600 mt-2 mb-8">Have questions? We'd love to hear from you.</p>
                    <form className="max-w-lg mx-auto text-left" onSubmit={handleContactSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                            <input type="text" id="name" name="name" value={contactForm.name} onChange={handleContactChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                            <input type="email" id="email" name="email" value={contactForm.email} onChange={handleContactChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                            <textarea id="message" name="message" value={contactForm.message} onChange={handleContactChange} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none" required></textarea>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="px-8 py-3 bg-brand-secondary text-white font-semibold rounded-md hover:bg-brand-primary transition-colors">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </section>
             
        </main>
        
        <footer className="text-center py-6">
            <div className="mb-4">
                <div className="flex justify-center space-x-6 text-sm">
                    <button onClick={() => setShowPrivacyPolicy(true)} className="text-brand-secondary hover:text-brand-primary transition-colors">Privacy Policy</button>
                    <button onClick={() => setShowTermsOfService(true)} className="text-brand-secondary hover:text-brand-primary transition-colors">Terms of Service</button>
                    <button onClick={() => setShowRefundPolicy(true)} className="text-brand-secondary hover:text-brand-primary transition-colors">Refund Policy</button>
                </div>
            </div>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Mines and Minerals Laws Ecosystem. All Rights Reserved.</p>
        </footer>
        {showPrivacyPolicy && <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />}
        {showTermsOfService && <TermsOfService onClose={() => setShowTermsOfService(false)} />}
        {showRefundPolicy && <RefundPolicy onClose={() => setShowRefundPolicy(false)} />}
    </div>
  );
});

export default LandingPage;