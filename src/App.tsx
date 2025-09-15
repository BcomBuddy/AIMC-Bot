import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelection from './components/LanguageSelection';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';

type AppState = 'login' | 'language-selection' | 'chat';
type Language = 'english' | 'urdu';

function App() {
  const [currentView, setCurrentView] = useState<AppState>('login');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user was previously authenticated
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setCurrentView('language-selection');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setCurrentView('language-selection');
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setCurrentView('chat');
  };

  const handleBackToLanguageSelection = () => {
    setCurrentView('language-selection');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setCurrentView('login');
  };

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        {currentView === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Login onLogin={handleLogin} />
          </motion.div>
        )}
        
        {currentView === 'language-selection' && (
          <motion.div
            key="language"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LanguageSelection onLanguageSelect={handleLanguageSelect} onLogout={handleLogout} />
          </motion.div>
        )}
        
        {currentView === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ChatInterface 
              language={selectedLanguage} 
              onBack={handleBackToLanguageSelection}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;