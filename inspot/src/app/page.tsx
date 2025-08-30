'use client';

import { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import EnhancedAuthPage from './components/EnhancedAuthPage';
import IntegratedDashboard from './components/IntegratedDashboard';

type AppState = 'welcome' | 'auth' | 'dashboard';

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('welcome');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentState('dashboard');
    }
  }, []);

  const handleWelcomeComplete = () => {
    setCurrentState('auth');
  };

  const handleLoginSuccess = () => {
    setCurrentState('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentState('auth');
  };

  return (
    <div className="min-h-screen">
      {currentState === 'welcome' && (
        <WelcomePage onComplete={handleWelcomeComplete} />
      )}
      
      {currentState === 'auth' && (
        <EnhancedAuthPage onLogin={handleLoginSuccess} />
      )}
      
      {currentState === 'dashboard' && (
        <IntegratedDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}
