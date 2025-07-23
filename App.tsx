import React, { useState, useCallback } from 'react';
import { UserCategory, RegistrationFormData, ProfileData, UserData, ConsultancyCase, ConsultancyStatus } from './types';
import LandingStep from './components/LandingStep';
import LoginStep from './components/LoginStep';
import RegistrationStep from './components/RegistrationStep';
import VerificationStep from './components/VerificationStep';
import ProfileStep from './components/ProfileStep';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Consultancy from './components/Consultancy';
import Admin from './components/Admin';

type AppStep = 'landing' | 'login' | 'registration' | 'verification' | 'profile' | 'dashboard' | 'library' | 'consultancy' | 'admin';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('landing');
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [consultancyCases, setConsultancyCases] = useState<ConsultancyCase[]>([]);

  const handleReset = useCallback(() => {
    setUserData({});
    setStep('landing');
  }, []);
  
  const handleAdminLogout = useCallback(() => {
    setUserData({});
    setAllUsers([]);
    setConsultancyCases([]);
    setStep('landing');
  }, []);

  const handleGoToLogin = useCallback(() => {
    setStep('login');
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
    const finalUserData = { ...userData, ...data } as UserData;
    setUserData(finalUserData);
    setAllUsers(prev => [...prev, finalUserData]);
    setStep('dashboard');
  }, [userData]);
  
  const handleBackToLanding = useCallback(() => {
      setUserData({});
      setStep('landing');
  }, []);
  
  const handleEnterLibrary = useCallback(() => {
    setStep('library');
  }, []);

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


  const renderStep = () => {
    switch (step) {
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
               />;
      case 'library':
        return <Library onBackToDashboard={handleBackToDashboard} />;
      case 'consultancy':
        return <Consultancy 
                  cases={consultancyCases.filter(c => c.userEmail === (userData as UserData).email)}
                  onBackToDashboard={handleBackToDashboard}
                  onSubmit={handleNewConsultancySubmit}
                  onPay={handlePaymentForCase}
                />;
      case 'admin':
        return <Admin users={allUsers} cases={consultancyCases} onLogout={handleAdminLogout} />;
      default:
        return <LandingStep onSelectCategory={handleCategorySelect} onLoginClick={handleGoToLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      {renderStep()}
    </div>
  );
};

export default App;
