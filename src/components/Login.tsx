import React, { useState } from 'react';
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin@123') {
      onLogin();
    } else {
      setError('Invalid credentials');
      setShakeKey(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-4 sm:left-10 w-16 sm:w-32 h-16 sm:h-32 border-2 border-yellow-400 transform rotate-45"></div>
        <div className="absolute top-40 right-4 sm:right-16 w-12 sm:w-24 h-12 sm:h-24 border-2 border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-32 left-4 sm:left-20 w-14 sm:w-28 h-14 sm:h-28 border-2 border-yellow-400 transform rotate-12"></div>
        <div className="absolute bottom-20 right-4 sm:right-32 w-10 sm:w-20 h-10 sm:h-20 border-2 border-yellow-400 rounded-full"></div>
      </div>

      <div className="max-w-md w-full relative z-10 px-2 sm:px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl">
              <Lock className="w-10 h-10 text-teal-900" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            AIMC Assistant
          </h1>
          <p className="text-base sm:text-lg text-teal-100">
            Supreme Court Judgment Portal
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          key={shakeKey}
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-lg border-2 border-yellow-400/30 rounded-3xl p-4 sm:p-8 shadow-2xl"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-yellow-300 text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-yellow-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white/20 border-2 border-yellow-400/30 rounded-xl focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 text-white placeholder-teal-200"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-yellow-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-yellow-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 bg-white/20 border-2 border-yellow-400/30 rounded-xl focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 text-white placeholder-teal-200"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-300 bg-red-500/20 p-3 rounded-xl border border-red-400/30"
              >
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-900 py-3 rounded-xl font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Login
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-xl p-4">
            <p className="text-yellow-100 text-sm">
              <span className="font-semibold text-yellow-300">Authorized Access Only</span><br />
              AIMC Portal - Supreme Court Judgment Analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;