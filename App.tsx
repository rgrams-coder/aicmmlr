
import React, { useState, useCallback, useRef } from 'react';
import { UserCategory, RegistrationFormData, ProfileData, UserData, ConsultancyCase, ConsultancyStatus, LibraryDocument, UserCategoryInfo, Feedback, ContactMessage } from './types';
import { INITIAL_LIBRARY_DATA, USER_CATEGORIES } from './constants';
import LandingPage from './components/LandingPage';
import LandingStep from './components/LandingStep';
import LoginStep from './components/LoginStep';
import RegistrationStep from './components/RegistrationStep';
import VerificationStep from './components/VerificationStep';
import ProfileStep from './components/ProfileStep';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Consultancy from './components/Consultancy';
import Admin from './components/Admin';
import Navbar from './components/Navbar';
import ProfileEditModal from './components/ProfileEditModal';
import FeedbackModal from './components/FeedbackModal';

type AppStep = 'introduction' | 'landing' | 'login' | 'registration' | 'verification' | 'profile' | 'dashboard' | 'library' | 'consultancy' | 'admin';

const modalSteps: AppStep[] = ['landing', 'login', 'registration', 'verification', 'profile'];

const App: React.FC = () => {
  const landingPageRefs = useRef({
    contactRef: React.createRef<HTMLDivElement>(),
    faqRef: React.createRef<HTMLDivElement>(),
  });

  const [step, setStep] = useState<AppStep>('introduction');
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [consultancyCases, setConsultancyCases] = useState<ConsultancyCase[]>([]);
  const [libraryData, setLibraryData] = useState<LibraryDocument[]>(INITIAL_LIBRARY_DATA);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const handleContactClick = useCallback(() => {
    if (step !== 'introduction') {
      setStep('introduction');
      setTimeout(() => {
        landingPageRefs.current.contactRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Small delay to allow the component to render
    } else {
      landingPageRefs.current.contactRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  const handleFaqClick = useCallback(() => {
    if (step !== 'introduction') {
      setStep('introduction');
      setTimeout(() => {
        landingPageRefs.current.faqRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Delay to allow rendering
    } else {
      landingPageRefs.current.faqRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  const handleReset = useCallback(() => {
    setUserData({});
    setStep('introduction');
  }, []);
  
  const handleAdminLogout = useCallback(() => {
    setUserData({});
    setStep('introduction');
  }, []);

  const handleGoToLogin = useCallback(() => {
    setStep('login');
  }, []);

  const handleGetStarted = useCallback(() => {
    setStep('landing');
  }, []);

  const handleLoginSubmit = useCallback((email: string, pass: string) => {
    // Admin Login Check
    if (email === 'admin@mail.com' && pass === 'admin123') {
        setStep('admin');
        return;
    }
      
    console.log(`Logging in with ${email} and ${pass}`);
    const mockUser: UserData = {
      name: 'Mock Premium User',
      email: email,
      phone: '123-456-7890',
      organization: 'Mock Industries',
      password: pass,
      category: UserCategory.LEASEE,
      address: '123 Mockingbird Lane',
      bio: 'A pre-existing user for demonstration purposes.',
      profilePicture: null,
      hasActiveSubscription: false,
    };
    setUserData(mockUser);
    setAllUsers(prev => {
      if (prev.find(u => u.email === mockUser.email)) {
          return prev;
      }
      return [...prev, mockUser];
    });
    setStep('dashboard');
  }, []);

  const handleCategorySelect = useCallback((category: UserCategory) => {
    setUserData({ category });
    setStep('registration');
  }, []);

  const handleRegistrationSubmit = useCallback((data: RegistrationFormData) => {
    setUserData(prev => ({ ...prev, ...data }));
    setStep('verification');
  }, []);

  const handleVerification = useCallback(() => {
    setStep('profile');
  }, []);

  const handleProfileSubmit = useCallback((data: ProfileData) => {
    const finalUserData = { ...userData, ...data, hasActiveSubscription: false } as UserData;
    setUserData(finalUserData);
    setAllUsers(prev => [...prev, finalUserData]);
    setStep('dashboard');
  }, [userData]);
  
  const handleBackToLanding = useCallback(() => {
      setUserData({});
      setStep('landing');
  }, []);
  
  const handleEnterLibrary = useCallback(() => {
    const currentUser = userData as UserData;
    if (currentUser.hasActiveSubscription) {
      setStep('library');
    } else {
      // This should ideally not be reached if the dashboard UI is correct
      alert('Please subscribe to access the Digital Library.');
    }
  }, [userData]);

  const handleBackToDashboard = useCallback(() => {
    setStep('dashboard');
  }, []);
  
  const handleEnterConsultancy = useCallback(() => {
    setStep('consultancy');
  }, []);
  
  const handleNewConsultancySubmit = useCallback((newCase: { issue: string; document: File | null }) => {
    const caseId = `CASE-${Date.now().toString().slice(-6)}`;
    const currentUser = userData as UserData;

    const newConsultancyCase: ConsultancyCase = {
      id: caseId,
      date: new Date().toISOString(),
      issue: newCase.issue,
      document: newCase.document,
      documentName: newCase.document?.name || 'N/A',
      status: ConsultancyStatus.PENDING,
      isPaid: false,
      userName: currentUser.name,
      userEmail: currentUser.email,
    };
  
    setConsultancyCases(prev => [newConsultancyCase, ...prev]);
  }, [userData]);

  const handlePaymentForCase = useCallback((caseId: string) => {
      setConsultancyCases(prev => prev.map(c =>
          c.id === caseId ? { ...c, isPaid: true, status: ConsultancyStatus.COMPLETED } : c
      ));
  }, []);
  
  const handleSubscribeToLibrary = useCallback(() => {
    const currentUser = userData as UserData;
    const categoryInfo = USER_CATEGORIES.find(cat => cat.value === currentUser.category);
    if (!categoryInfo) {
        alert('Error: Could not find user category information.');
        return;
    }

    const options = {
      key: 'rzp_test_VWCS3cXessJ8LA',
      amount: categoryInfo.subscriptionPrice * 100, // Amount in paise
      currency: "INR",
      name: "Mines and Minerals Laws - Library Subscription",
      description: `Annual subscription for ${categoryInfo.label}`,
      handler: (response: any) => {
        console.log('Subscription payment successful:', response);
        const updatedUserData = { ...currentUser, hasActiveSubscription: true };
        setUserData(updatedUserData);
        
        setAllUsers(prevUsers => prevUsers.map(user => 
            user.email === currentUser.email ? updatedUserData : user
        ));
        alert('Subscription successful! You now have full access to the Digital Library.');
      },
      prefill: {
        name: currentUser.name,
        email: currentUser.email,
        contact: currentUser.phone,
      },
      theme: {
        color: "#1a3b5d",
      },
      modal: {
        ondismiss: () => {
          console.log('Razorpay modal dismissed for subscription.');
        }
      }
    };
    
    const razorpay = new (window as any).Razorpay(options);
    razorpay.on('payment.failed', function (response: any){
      alert(`Payment failed: ${response.error.description}`);
      console.error(response.error);
    });
    razorpay.open();
  }, [userData]);

  const handleAddDocument = useCallback((doc: LibraryDocument, file: File | null) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const newDoc = { ...doc, content: fileUrl };
      setLibraryData(prev => [newDoc, ...prev]);
    } else {
      // Handle case where document is added without a file, if applicable
      setLibraryData(prev => [doc, ...prev]);
    }
  }, []);

  const handleUpdateDocument = useCallback((updatedDoc: LibraryDocument, file: File | null) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const newDoc = { ...updatedDoc, content: fileUrl };
      setLibraryData(prev => prev.map(doc => doc.id === newDoc.id ? newDoc : doc));
    } else {
      setLibraryData(prev => prev.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc));
    }
  }, []);

  const handleDeleteDocument = useCallback((docId: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
        setLibraryData(prev => prev.filter(doc => doc.id !== docId));
    }
  }, []);
  
  const handleAdminLoginClick = useCallback(() => {
    setStep('login');
  }, []);

  const handleNavigateHome = useCallback(() => {
    // If user has an address, they are fully registered and logged in.
    if (userData.address) {
      setStep('dashboard');
    } else {
      setStep('introduction');
    }
  }, [userData.address]);

  const handleOpenEditProfile = useCallback(() => {
    setEditProfileModalOpen(true);
  }, []);

  const handleCloseEditProfile = useCallback(() => {
    setEditProfileModalOpen(false);
  }, []);

  const handleOpenFeedbackModal = useCallback(() => {
    setFeedbackModalOpen(true);
  }, []);

  const handleCloseFeedbackModal = useCallback(() => {
    setFeedbackModalOpen(false);
  }, []);

  const handleFeedbackSubmit = useCallback((feedbackText: string) => {
    const currentUser = userData as UserData;
    const newFeedback: Feedback = {
      id: `FDBK-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      userName: currentUser.name,
      userEmail: currentUser.email,
      feedbackText,
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
    setFeedbackModalOpen(false);
    alert('Thank you for your feedback!');
  }, [userData]);

  const handleContactSubmit = useCallback((formData: { name: string; email: string; message: string }) => {
    const newContactMessage: ContactMessage = {
      id: `MSG-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      ...formData,
    };
    setContactMessages(prev => [newContactMessage, ...prev]);
  }, []);

  const handleProfileUpdate = useCallback((updatedData: Partial<UserData>, newPassword?: string) => {
    setUserData(prev => ({ ...prev, ...updatedData }));
    setAllUsers(prev => prev.map(u => u.email === userData.email ? { ...u, ...updatedData } : u));

    if (newPassword) {
      // In a real app, you'd make an API call to update the password.
      // For this mock, we'll just log it.
      console.log(`Password for ${userData.email} updated to: ${newPassword}`);
      alert('Profile and password updated successfully!');
    } else {
      alert('Profile updated successfully!');
    }

    setEditProfileModalOpen(false);
  }, [userData.email]);

  const handleAdminUpdateCase = useCallback((caseId: string, solution: string, fee: number, solutionFile: File | null) => {
    setConsultancyCases(prev => prev.map(c => 
      c.id === caseId 
        ? { 
            ...c, 
            solution,
            fee,
            solutionDocument: solutionFile,
            solutionDocumentName: solutionFile?.name || '',
            status: ConsultancyStatus.SOLUTION_READY,
          } 
        : c
    ));
  }, []);


  const renderStep = () => {
    switch (step) {
      case 'introduction':
        return <LandingPage ref={landingPageRefs} onGetStarted={handleGetStarted} onLoginClick={handleGoToLogin} />;
      case 'landing':
        return <LandingStep onSelectCategory={handleCategorySelect} onLoginClick={handleGoToLogin} />;
      case 'login':
        return <LoginStep onSubmit={handleLoginSubmit} onSwitchToRegister={handleBackToLanding} />;
      case 'registration':
        return (
          <RegistrationStep
            userCategory={userData.category as UserCategory}
            onSubmit={handleRegistrationSubmit}
            onBack={handleBackToLanding}
          />
        );
      case 'verification':
        return (
          <VerificationStep
            email={userData.email as string}
            onVerified={handleVerification}
          />
        );
      case 'profile':
        return (
          <ProfileStep 
            userCategory={userData.category as UserCategory} 
            onSubmit={handleProfileSubmit} 
          />
        );
      case 'dashboard':
        return <Dashboard 
                  userData={userData as UserData} 
                  onEnterLibrary={handleEnterLibrary}
                  onEnterConsultancy={handleEnterConsultancy}
                  onSubscribe={handleSubscribeToLibrary}
                  onEditProfile={handleOpenEditProfile}
               />;
      case 'library':
        return <Library documents={libraryData} onBackToDashboard={handleBackToDashboard} />;
      case 'consultancy':
        return <Consultancy 
                  userData={userData as UserData}
                  cases={consultancyCases.filter(c => c.userEmail === (userData as UserData).email)}
                  onBackToDashboard={handleBackToDashboard}
                  onSubmit={handleNewConsultancySubmit}
                  onPay={handlePaymentForCase}
                />;
      case 'admin':
        return <Admin 
                  users={allUsers} 
                  cases={consultancyCases} 
                  documents={libraryData}
                  onLogout={handleAdminLogout} 
                  onAddDocument={handleAddDocument}
                  onUpdateDocument={handleUpdateDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onUpdateCase={handleAdminUpdateCase}
                  feedbacks={feedbacks}
                  contactMessages={contactMessages}
                />;
      default:
        return <LandingPage ref={landingPageRefs} onGetStarted={handleGetStarted} onLoginClick={handleGoToLogin} onContactSubmit={handleContactSubmit} />;
    }
  };

  const showNavbar = step !== 'admin';
  const isModalStep = modalSteps.includes(step);
  const isUserLoggedIn = !!userData.address;

  return (
    <div className="bg-brand-light min-h-screen flex flex-col">
      {showNavbar && <Navbar onAdminLoginClick={handleAdminLoginClick} onLogoClick={handleNavigateHome} isUserLoggedIn={isUserLoggedIn} onLogoutClick={handleReset} onFeedbackClick={handleOpenFeedbackModal} onContactClick={handleContactClick} onFaqClick={handleFaqClick} />}
      <main className={`flex-grow ${isModalStep ? 'p-4 flex items-center justify-center' : 'p-4'}`}>
        {renderStep()}
      </main>
      {isEditProfileModalOpen && userData && (
        <ProfileEditModal 
          user={userData as UserData}
          onClose={handleCloseEditProfile}
          onSave={handleProfileUpdate}
        />
      )}

      {isFeedbackModalOpen && (
        <FeedbackModal 
          onClose={handleCloseFeedbackModal}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default App;