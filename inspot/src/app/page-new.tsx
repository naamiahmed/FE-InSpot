'use client';

import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import AuthPage from './components/AuthPage';
import Dashboard from './pages/dashboard';

type AppState = 'welcome' | 'auth' | 'dashboard';

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('welcome');

  const handleWelcomeComplete = () => {
    setCurrentState('auth');
  };

  const handleLoginSuccess = () => {
    setCurrentState('dashboard');
  };

  const handleLogout = () => {
    setCurrentState('auth');
  };

  return (
    <div className="min-h-screen">
      {currentState === 'welcome' && (
        <WelcomePage onComplete={handleWelcomeComplete} />
      )}
      
      {currentState === 'auth' && (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
      
      {currentState === 'dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}
