
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UserCategory, RegistrationFormData, ProfileData, UserData, ConsultancyCase, ConsultancyStatus, LibraryDocument, UserCategoryInfo, Feedback, ContactMessage } from './types';
import { USER_CATEGORIES } from './constants';
import { apiService } from './services/api';
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
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [consultancyCases, setConsultancyCases] = useState<ConsultancyCase[]>([]);
  const [libraryData, setLibraryData] = useState<LibraryDocument[]>([]);
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
    localStorage.removeItem('token');
    setUserData({});
    setStep('introduction');
  }, []);
  
  const handleAdminLogout = useCallback(() => {
    localStorage.removeItem('token');
    setUserData({});
    setStep('introduction');
  }, []);

  const handleGoToLogin = useCallback(() => {
    setStep('login');
  }, []);

  const handleGetStarted = useCallback(() => {
    setStep('landing');
  }, []);

  const handleLoginSubmit = useCallback(async (email: string, pass: string) => {
    try {
      let response;
      if (email.includes('admin')) {
        response = await apiService.adminLogin(email, pass);
        localStorage.setItem('token', response.token);
        setUserData(response.admin);
        setStep('admin');
      } else {
        response = await apiService.login(email, pass);
        localStorage.setItem('token', response.token);
        setUserData(response.user);
        setStep('dashboard');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  }, []);

  const handleCategorySelect = useCallback((category: UserCategory) => {
    setUserData({ category });
    setStep('registration');
  }, []);

  const handleRegistrationSubmit = useCallback(async (data: RegistrationFormData) => {
    try {
      const response = await apiService.register({
        ...data,
        category: userData.category
      });
      localStorage.setItem('token', response.token);
      setUserData(response.user);
      setStep('verification');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Registration failed');
    }
  }, [userData.category]);

  const handleVerification = useCallback(() => {
    setStep('profile');
  }, []);

  const handleProfileSubmit = useCallback(async (data: ProfileData) => {
    try {
      const response = await apiService.updateProfile(data);
      setUserData(response.user);
      setStep('dashboard');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Profile update failed');
    }
  }, []);
  
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
  
  const handleSubscribeToLibrary = useCallback(async () => {
    const currentUser = userData as UserData;
    const categoryInfo = USER_CATEGORIES.find(cat => cat.value === currentUser.category);
    if (!categoryInfo) {
        alert('Error: Could not find user category information.');
        return;
    }

    try {
      const orderData = await apiService.createOrder(categoryInfo.subscriptionPrice);
      
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Mines and Minerals Laws - Library Subscription",
        description: `Annual subscription for ${categoryInfo.label}`,
        handler: async (response: any) => {
          try {
            await apiService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            const updatedUser = await apiService.getProfile();
            setUserData(updatedUser.user);
            alert('Subscription successful! You now have full access to the Digital Library.');
          } catch (error) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
          contact: currentUser.phone,
        },
        theme: {
          color: "#1a3b5d",
        }
      };
      
      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', function (response: any){
        alert(`Payment failed: ${response.error.description}`);
      });
      razorpay.open();
    } catch (error) {
      alert('Failed to create subscription order');
    }
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

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthState = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiService.getProfile();
          setUserData(response.user);
          if (response.user.role === 'admin') {
            setStep('admin');
          } else {
            setStep('dashboard');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    
    checkAuthState();
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

  if (isLoading) {
    return (
      <div className="bg-brand-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark mx-auto mb-4"></div>
          <p className="text-brand-dark">Loading...</p>
        </div>
      </div>
    );
  }

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