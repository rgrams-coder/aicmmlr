
import React, { useState, forwardRef } from 'react';
import MiningIcon from './icons/MiningIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UsersIcon from './icons/UsersIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

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

  const faqData = [
    {
      question: 'What is the Mines and Minerals Laws Ecosystem?',
      answer: 'It is a comprehensive online platform providing access to a digital library of mining laws, expert legal consultancy, and compliance resources for professionals in the mines and minerals sector.',
    },
    {
      question: 'Who can benefit from this platform?',
      answer: 'Our platform is designed for a wide range of users, including mineral dealers, lessees, government officials, law firms, students, and researchers involved in the mining industry.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a free trial period that gives you limited access to our digital library. Premium features like expert consultancy require a subscription.',
    },
    {
      question: 'How do I subscribe to premium features?',
      answer: 'You can subscribe to our premium features through the dashboard after creating an account. We offer various subscription plans to suit your needs.',
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
      description: 'Whether you\'re a mineral dealer, a student, or a government official, our platform provides features relevant to your role.',
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
                            This site is still in development phase. Kindly support us by registration.
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
                        <span className="bg-brand-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">Government Officials</span>
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
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Mines and Minerals Laws Ecosystem. All Rights Reserved.</p>
        </footer>
    </div>
  );
});

export default LandingPage;