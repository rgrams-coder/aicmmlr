
import React from 'react';
import MiningIcon from './icons/MiningIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UsersIcon from './icons/UsersIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLoginClick }) => {
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
      description: 'Whether you\'re a mining dealer, a student, or a government official, our platform provides features relevant to your role.',
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

            {/* Features Section */}
            <section className="py-12 md:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">A Comprehensive Mines and Minerals Legal Ecosystem</h2>
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
                        <span className="bg-brand-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">Mining Dealers</span>
                        <span className="bg-brand-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">Leasees</span>
                        <span className="bg-brand-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">Government Officials</span>
                        <span className="bg-brand-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">Firms & Companies</span>
                        <span className="bg-brand-accent text-brand-dark px-4 py-1 rounded-full text-sm font-semibold">Students</span>
                        <span className="bg-brand-accent text-brand-dark px-4 py-1 rounded-full text-sm font-semibold">Researchers</span>
                    </div>
                 </div>
            </section>

            
             
        </main>
        
        <footer className="text-center py-6">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Mines and Minerals Laws Ecosystem. All Rights Reserved.</p>
        </footer>
    </div>
  );
};

export default LandingPage;