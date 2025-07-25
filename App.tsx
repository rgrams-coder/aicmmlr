



import React, { useState, useCallback } from 'react';
import { UserCategory, RegistrationFormData, ProfileData, UserData, ConsultancyCase, ConsultancyStatus, LibraryDocument, UserCategoryInfo } from './types';
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

type AppStep = 'introduction' | 'landing' | 'login' | 'registration' | 'verification' | 'profile' | 'dashboard' | 'library' | 'consultancy' | 'admin';

const modalSteps: AppStep[] = ['landing', 'login', 'registration', 'verification', 'profile'];

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('introduction');
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [consultancyCases, setConsultancyCases] = useState<ConsultancyCase[]>([]);
  const [libraryData, setLibraryData] = useState<LibraryDocument[]>(INITIAL_LIBRARY_DATA);

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
  
    // Simulate expert review and solution
    setTimeout(() => {
      setConsultancyCases(prev => prev.map(c => 
        c.id === caseId 
          ? { 
              ...c, 
              status: ConsultancyStatus.SOLUTION_READY, 
              solution: `This is the expert's detailed solution for your query regarding: "${c.issue.substring(0, 50)}...".\n\nThe solution involves reviewing Section 4 of the MMDR Act, 1957, and considering the recent circular dated 2022-01-15. We recommend a full legal review of your attached documents to provide a conclusive opinion.` 
            } 
          : c
      ));
    }, 5000 + Math.random() * 2000); // 5-7 second delay
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

  const handleAddDocument = useCallback((doc: LibraryDocument) => {
    setLibraryData(prev => [doc, ...prev]);
  }, []);

  const handleUpdateDocument = useCallback((updatedDoc: LibraryDocument) => {
    setLibraryData(prev => prev.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc));
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


  const renderStep = () => {
    switch (step) {
      case 'introduction':
        return <LandingPage onGetStarted={handleGetStarted} onLoginClick={handleGoToLogin} />;
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
        return <ProfileStep onSubmit={handleProfileSubmit} />;
      case 'dashboard':
        return <Dashboard 
                  userData={userData as UserData} 
                  onReset={handleReset} 
                  onEnterLibrary={handleEnterLibrary}
                  onEnterConsultancy={handleEnterConsultancy}
                  onSubscribe={handleSubscribeToLibrary}
               />;
      case 'library':
        return <Library documents={libraryData} onBackToDashboard={handleBackToDashboard} />;
      case 'consultancy':
        return <Consultancy 
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
                />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} onLoginClick={handleGoToLogin} />;
    }
  };

  const showNavbar = step !== 'admin';
  const isModalStep = modalSteps.includes(step);
  const isUserLoggedIn = !!userData.address;

  return (
    <div className="bg-brand-light min-h-screen flex flex-col">
      {showNavbar && <Navbar onAdminLoginClick={handleAdminLoginClick} onLogoClick={handleNavigateHome} isUserLoggedIn={isUserLoggedIn} onLogoutClick={handleReset} />}
      <main className={`flex-grow ${isModalStep ? 'p-4 flex items-center justify-center' : 'p-4'}`}>
        {renderStep()}
      </main>
    </div>
  );
};

export default App;