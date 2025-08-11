
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UserCategory, RegistrationFormData, ProfileData, UserData, ConsultancyCase, ConsultancyStatus, LibraryDocument, UserCategoryInfo, Feedback, ContactMessage } from './types';
import { USER_CATEGORIES } from './constants';
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
  const [libraryData, setLibraryData] = useState<LibraryDocument[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  
  // Initialize with data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, we're not logged in, so don't try to fetch data
        console.log('No token found in localStorage, skipping API calls');
        return;
      }
      
      // Log token for debugging
      console.log('Using token for API calls:', token);
      
      // Decode token to see what's inside (for debugging only)
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded token payload:', payload);
          console.log('Token expiration:', new Date(payload.exp * 1000).toLocaleString());
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
      try {
        // Fetch user profile data first
        console.log('Fetching profile data...');
        try {
          const profileResponse = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('Profile response status:', profileResponse.status);
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('Profile data fetched:', profileData);
            // Update user data with profile information
            setUserData(prevData => {
              // Check if profileData exists and has _id before accessing it
              const mongoId = profileData && profileData._id ? profileData._id : prevData.id;
              return {
                ...prevData,
                ...profileData,
                id: mongoId // MongoDB uses _id
              };
            });
          } else {
            const errorText = await profileResponse.text();
            console.error(`Failed to fetch profile (${profileResponse.status}):`, errorText);
            
            // If profile fetch fails with 401, token might be invalid
            if (profileResponse.status === 401) {
              console.log('Authentication failed, clearing token and redirecting to login');
              localStorage.removeItem('token');
              setStep('login');
              alert('Your session has expired. Please log in again.');
              return; // Stop further API calls
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
        
        // Fetch library documents
        const libraryResponse = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/documents', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (libraryResponse.ok) {
          const libraryData = await libraryResponse.json();
          setLibraryData(libraryData);
        }
        
        // Fetch consultancy cases
        const casesResponse = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/cases', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (casesResponse.ok) {
          const casesData = await casesResponse.json();
          setConsultancyCases(casesData);
        }
        
        // Fetch feedback data (admin only)
        if (userData?.role === 'admin') {
          const feedbackResponse = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/feedback', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (feedbackResponse.ok) {
            const feedbackData = await feedbackResponse.json();
            setFeedbacks(feedbackData);
          }
          
          // Fetch contact messages (admin only)
          const contactResponse = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/contacts', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (contactResponse.ok) {
            const contactData = await contactResponse.json();
            setContactMessages(contactData);
          }
          
          // Fetch user list (admin only)
          const usersResponse = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/users', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            setAllUsers(usersData);
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    
    fetchInitialData();
  }, [userData?.id]); // Only re-fetch when user ID changes

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

  const handleLoginSubmit = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.message || 'Login failed');
        return;
      }
      
      // Store token in localStorage for future API calls
      localStorage.setItem('token', data.token);
      console.log('Login successful, token stored:', data.token);
      
      // Check if user is admin
      if (data.user && data.user.role === 'admin') {
        // Make sure we have all user data
        const userData = {
          ...data.user,
          id: data.user && data.user._id ? data.user._id : (data.user ? data.user.id : ''), // MongoDB uses _id
          email: data.user.email || '',
          role: data.user.role || '',
          name: data.user.name || '',
          hasActiveSubscription: data.user.hasActiveSubscription || false
        };
        console.log('Admin user data set:', userData);
        setUserData(userData);
        setStep('admin');
        return;
      }
      
      // Set user data and redirect to dashboard
      const userData = {
        ...data.user,
        id: data.user && data.user._id ? data.user._id : (data.user ? data.user.id : ''), // MongoDB uses _id
        email: data.user && data.user.email ? data.user.email : '',
        role: data.user && data.user.role ? data.user.role : 'user',
        name: data.user && data.user.name ? data.user.name : '',
        hasActiveSubscription: data.user && data.user.hasActiveSubscription ? data.user.hasActiveSubscription : false
      };
      console.log('Regular user data set:', userData);
      setUserData(userData);
      setStep('dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  }, []);

  const handleCategorySelect = useCallback((category: UserCategory) => {
    setUserData({ category });
    setStep('registration');
  }, []);

  const handleRegistrationSubmit = useCallback(async (data: RegistrationFormData) => {
    try {
      // Combine category with registration data
      const registrationData = {
        ...data,
        category: userData.category
      };
      
      const response = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        alert(responseData.message || 'Registration failed');
        return;
      }
      
      // Store token if returned from backend
      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
        console.log('Registration successful, token stored:', responseData.token);
      }
      
      // Since the backend doesn't return user data on registration,
      // we'll use the form data and fetch the user profile after verification
      const newUserData = {
        ...userData,
        email: data.email,
        name: data.name,
        phone: data.phone,
        organization: data.organization,
        category: userData.category,
        // Generate a temporary ID until we get the real one from the backend
        id: `temp-${Date.now()}`
      };
      
      setUserData(newUserData);
      setStep('verification');
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration. Please try again.');
    }
  }, [userData.category]);

  const handleVerification = useCallback(() => {
    setStep('profile');
  }, []);

  const handleProfileSubmit = useCallback(async (data: ProfileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        alert('Authentication error. Please log in again.');
        setStep('login');
        return;
      }
      
      console.log('Updating profile with data:', data);
      console.log('Using token:', token);
      
      // Decode token to check expiration
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload for profile submit:', payload);
          const expiration = new Date(payload.exp * 1000);
          console.log('Token expiration:', expiration.toLocaleString());
          
          // Check if token is expired
          if (expiration < new Date()) {
            console.error('Token has expired');
            localStorage.removeItem('token');
            alert('Your session has expired. Please log in again.');
            setStep('login');
            return;
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
      const response = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      
      console.log('Profile update response status:', response.status);
      
      const responseData = await response.json();
      console.log('Profile update response data:', responseData);
      
      if (!response.ok) {
        console.error(`Profile update failed (${response.status}):`, responseData);
        
        if (response.status === 401) {
          // Handle authentication failure
          localStorage.removeItem('token');
          alert(responseData.message || 'Your session has expired. Please log in again.');
          setStep('login');
          return;
        }
        
        alert(responseData.message || 'Profile update failed');
        
        // If authentication failed, redirect to login
        if (response.status === 401) {
          console.log('Authentication failed during profile update, clearing token');
          localStorage.removeItem('token');
          setStep('login');
          alert('Your session has expired. Please log in again.');
        }
        return;
      }
      
      // Update user data with profile data and API response
      // Ensure we're using the correct ID field (MongoDB uses _id)
      const finalUserData = { 
        ...userData, 
        ...data, 
        ...responseData,
        id: responseData && responseData._id ? responseData._id : userData.id // Preserve ID mapping
      } as UserData;
      console.log('Profile updated, new user data:', finalUserData);
      setUserData(finalUserData);
      setStep('dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('An error occurred while updating your profile. Please try again.');
    }
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
  
  const handleNewConsultancySubmit = useCallback(async (newCase: { issue: string; document: File | null }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication error. Please log in again.');
        setStep('login');
        return;
      }
      
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('issue', newCase.issue);
      if (newCase.document) {
        formData.append('document', newCase.document);
      }
      
      const response = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/cases', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        alert(responseData.message || 'Failed to submit case');
        return;
      }
      
      // Add the new case to the state
      setConsultancyCases(prev => [responseData, ...prev]);
      alert('Your case has been submitted successfully!');
    } catch (error) {
      console.error('Case submission error:', error);
      alert('An error occurred while submitting your case. Please try again.');
    }
  }, []);

  const handlePaymentForCase = useCallback(async (caseId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication error. Please log in again.');
        setStep('login');
        return;
      }
      
      // First, create a payment order
      const orderResponse = await fetch(`https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/payments/create-order/${caseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderResponse.ok) {
        alert(orderData.message || 'Failed to create payment order');
        return;
      }
      
      // Get the case to display payment details
      const caseToPayFor = consultancyCases.find(c => c.id === caseId);
      if (!caseToPayFor) {
        alert('Case not found');
        return;
      }
      
      // Configure Razorpay payment
      const options = {
        key: 'rzp_test_VWCS3cXessJ8LA', // Should come from environment variables
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Mining Consultancy Service",
        description: `Payment for case: ${caseId}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          // Verify payment with backend
          const verifyResponse = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              case_id: caseId
            }),
          });
          
          const verifyData = await verifyResponse.json();
          
          if (!verifyResponse.ok) {
            alert(verifyData.message || 'Payment verification failed');
            return;
          }
          
          // Update local state
          setConsultancyCases(prev => prev.map(c =>
            c.id === caseId ? { ...c, isPaid: true, status: ConsultancyStatus.COMPLETED } : c
          ));
          
          alert('Payment successful! You can now access the solution.');
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.phone,
        },
        theme: {
          color: "#1a3b5d",
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay payment modal dismissed');
          }
        }
      };
      
      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', function (response: any){
        alert(`Payment failed: ${response.error.description}`);
        console.error(response.error);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred during payment processing. Please try again.');
    }
  }, [consultancyCases, userData]);
  
  const handleSubscribeToLibrary = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication error. Please log in again.');
        setStep('login');
        return;
      }
      
      // Get user category info for display purposes
      const currentUser = userData as UserData;
      const categoryInfo = USER_CATEGORIES.find(cat => cat.value === currentUser.category);
      if (!categoryInfo) {
        alert('Error: Could not find user category information.');
        return;
      }
      
      // Create subscription order
      const orderResponse = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/payments/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderResponse.ok) {
        alert(orderData.message || 'Failed to create subscription order');
        return;
      }
      
      // Configure Razorpay payment
      const options = {
        key: 'rzp_test_VWCS3cXessJ8LA',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Mines and Minerals Laws - Library Subscription",
        description: `Annual subscription for ${categoryInfo.label}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          // Verify payment with backend
          const verifyResponse = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/payments/verify-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }),
          });
          
          const verifyData = await verifyResponse.json();
          
          if (!verifyResponse.ok) {
            alert(verifyData.message || 'Subscription verification failed');
            return;
          }
          
          // Update user data with subscription status
          const updatedUserData = { ...currentUser, hasActiveSubscription: true };
          setUserData(updatedUserData);
          
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
    } catch (error) {
      console.error('Subscription error:', error);
      alert('An error occurred during subscription processing. Please try again.');
    }
  }, [userData]);

  const handleAddDocument = useCallback(async (doc: LibraryDocument, file: File | null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication error. Please log in again.');
        setStep('login');
        return;
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('type', doc.type);
      formData.append('title', doc.title);
      formData.append('description', doc.description);
      if (doc.content) {
        formData.append('content', doc.content);
      }
      if (file) {
        formData.append('fileData', file);
        formData.append('fileName', file.name);
      }
      
      const response = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        alert(responseData.message || 'Failed to add document');
        return;
      }
      
      // Add the new document to the state
      setLibraryData(prev => [responseData, ...prev]);
      alert('Document added successfully!');
    } catch (error) {
      console.error('Document add error:', error);
      alert('An error occurred while adding the document. Please try again.');
    }
  }, []);

  const handleUpdateDocument = useCallback(async (updatedDoc: LibraryDocument, file: File | null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication error. Please log in again.');
        setStep('login');
        return;
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('type', updatedDoc.type);
      formData.append('title', updatedDoc.title);
      formData.append('description', updatedDoc.description);
      if (updatedDoc.content) {
        formData.append('content', updatedDoc.content);
      }
      if (file) {
        formData.append('fileData', file);
        formData.append('fileName', file.name);
      }
      
      const response = await fetch(`https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/documents/${updatedDoc.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        alert(responseData.message || 'Failed to update document');
        return;
      }
      
      // Update the document in the state
      setLibraryData(prev => prev.map(doc => doc.id === responseData.id ? responseData : doc));
      alert('Document updated successfully!');
    } catch (error) {
      console.error('Document update error:', error);
      alert('An error occurred while updating the document. Please try again.');
    }
  }, []);

  const handleDeleteDocument = useCallback(async (docId: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Authentication error. Please log in again.');
          setStep('login');
          return;
        }
        
        const response = await fetch(`https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/documents/${docId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          alert(responseData.message || 'Failed to delete document');
          return;
        }
        
        // Remove the document from the state
        setLibraryData(prev => prev.filter(doc => doc.id !== docId));
        alert('Document deleted successfully!');
      } catch (error) {
        console.error('Document delete error:', error);
        alert('An error occurred while deleting the document. Please try again.');
      }
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

  const handleFeedbackSubmit = useCallback(async (feedbackText: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication error. Please log in again.');
        setStep('login');
        return;
      }
      
      const currentUser = userData as UserData;
      const newFeedback: Feedback = {
        id: `FDBK-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        userName: currentUser.name,
        userEmail: currentUser.email,
        feedbackText,
      };
      
      const response = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFeedback),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        alert(responseData.message || 'Failed to submit feedback');
        return;
      }
      
      // Add the new feedback to the state
      setFeedbacks(prev => [responseData, ...prev]);
      setFeedbackModalOpen(false);
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('An error occurred while submitting your feedback. Please try again.');
    }
  }, [userData]);

  const handleContactSubmit = useCallback(async (formData: { name: string; email: string; message: string }) => {
    try {
      const newContactMessage: ContactMessage = {
        id: `MSG-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        ...formData,
      };
      
      const response = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContactMessage),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        alert(responseData.message || 'Failed to submit contact form');
        return;
      }
      
      // Add the new contact to the state
      setContactMessages(prev => [responseData, ...prev]);
      alert('Thank you for contacting us! We will get back to you soon.');
    } catch (error) {
      console.error('Contact submission error:', error);
      alert('An error occurred while submitting your contact form. Please try again.');
    }
  }, []);

  const handleProfileUpdate = useCallback(async (updatedData: Partial<UserData>, newPassword?: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        alert('Authentication error. Please log in again.');
        setStep('login');
        return;
      }
      
      // Log token for debugging
      console.log('Using token for profile update:', token);
      
      // Decode token to check expiration
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload for profile update:', payload);
          const expiration = new Date(payload.exp * 1000);
          console.log('Token expiration:', expiration.toLocaleString());
          
          // Check if token is expired
          if (expiration < new Date()) {
            console.error('Token has expired');
            localStorage.removeItem('token');
            alert('Your session has expired. Please log in again.');
            setStep('login');
            return;
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
      // Include password in update data if provided
      const updatePayload = newPassword 
        ? { ...updatedData, password: newPassword }
        : updatedData;
      
      console.log('Sending profile update with payload:', updatePayload);
      
      const response = await fetch('https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload),
      });
      
      console.log('Profile update response status:', response.status);
      
      const responseData = await response.json();
      console.log('Profile update response data:', responseData);
      
      if (!response.ok) {
        console.error(`Profile update failed (${response.status}):`, responseData);
        
        if (response.status === 401) {
          // Handle authentication failure
          localStorage.removeItem('token');
          alert(responseData.message || 'Your session has expired. Please log in again.');
          setStep('login');
          return;
        }
        
        alert(responseData.message || 'Profile update failed');
        return;
      }
      
      // Update local state with response data
      setUserData(prev => ({ ...prev, ...responseData }));
      
      alert('Profile updated successfully!');
      setEditProfileModalOpen(false);
    } catch (error) {
      console.error('Profile update error:', error);
      alert('An error occurred while updating your profile. Please try again.');
    }
  }, []);

  const handleAdminUpdateCase = useCallback(async (caseId: string, solution: string, fee: number, solutionFile: File | null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication error. Please log in again.');
        setStep('login');
        return;
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('solution', solution);
      formData.append('fee', fee.toString());
      formData.append('status', ConsultancyStatus.SOLUTION_READY);
      if (solutionFile) {
        formData.append('solutionFile', solutionFile);
      }
      
      const response = await fetch(`https://u6qodot0x3.execute-api.ap-south-1.amazonaws.com/cases/${caseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        alert(responseData.message || 'Failed to update case');
        return;
      }
      
      // Update the case in the state
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
      alert('Case updated successfully!');
    } catch (error) {
      console.error('Admin case update error:', error);
      alert('An error occurred while updating the case. Please try again.');
    }
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