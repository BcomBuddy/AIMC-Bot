import React from 'react';
import { Globe, MessageCircle, LogOut } from 'lucide-react';

interface LanguageSelectionProps {
  onLanguageSelect: (language: 'english' | 'urdu') => void;
  onLogout: () => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onLanguageSelect, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-4 sm:left-10 w-16 sm:w-32 h-16 sm:h-32 border-2 border-yellow-400 transform rotate-45"></div>
        <div className="absolute top-40 right-4 sm:right-16 w-12 sm:w-24 h-12 sm:h-24 border-2 border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-32 left-4 sm:left-20 w-14 sm:w-28 h-14 sm:h-28 border-2 border-yellow-400 transform rotate-12"></div>
        <div className="absolute bottom-20 right-4 sm:right-32 w-10 sm:w-20 h-10 sm:h-20 border-2 border-yellow-400 rounded-full"></div>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10 px-2 sm:px-4">
        {/* Header with Logout */}
        <div className="mb-8 sm:mb-16">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="w-8 sm:w-16"></div> {/* Spacer for centering */}
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl">
                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-teal-900" />
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg text-yellow-400 hover:bg-yellow-400/20 transition-colors hover:scale-105"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Logout</span>
            </button>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            AIMC Assistant
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-teal-100 mb-3 sm:mb-4">
            Supreme Court Judgment on Waqf Amendment Bill
          </p>
          <p className="text-sm sm:text-lg text-teal-200 max-w-2xl mx-auto px-2">
            Get information about the latest judgment and chat with your own documents
          </p>
        </div>

        {/* Language Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-3xl mx-auto mb-8 sm:mb-12">
          {/* English Card */}
          <div 
            onClick={() => onLanguageSelect('english')}
            className="group bg-white/10 backdrop-blur-sm border-2 border-yellow-400/30 rounded-3xl p-4 sm:p-8 hover:bg-white/20 hover:border-yellow-400/60 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-teal-900" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 group-hover:text-yellow-300 transition-colors">
                English
              </h3>
              <p className="text-teal-100 text-center leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                Get information about the Supreme Court judgment on Waqf Amendment Bill and chat with your own documents in English
              </p>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-sm text-yellow-300 mt-4 font-semibold">Click to Continue →</p>
            </div>
          </div>

          {/* Urdu Card */}
          <div 
            onClick={() => onLanguageSelect('urdu')}
            className="group bg-white/10 backdrop-blur-sm border-2 border-yellow-400/30 rounded-3xl p-4 sm:p-8 hover:bg-white/20 hover:border-yellow-400/60 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-teal-900 font-bold text-lg sm:text-xl">ا</div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 group-hover:text-yellow-300 transition-colors">
                اردو
              </h3>
              <p className="text-teal-100 text-center leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base" dir="rtl">
                سپریم کورٹ کے وقف ترمیمی بل کے فیصلے کے بارے میں معلومات حاصل کریں اور اپنی دستاویزات کے ساتھ بات چیت کریں
              </p>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-sm text-yellow-300 mt-4 font-semibold" dir="rtl">← جاری رکھنے کے لیے کلک کریں</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-yellow-100 text-sm leading-relaxed">
            <span className="font-semibold text-yellow-300">Disclaimer:</span> This AIMC assistant provides information about the Supreme Court judgment on Waqf Amendment Bill. 
            You can also upload and chat with your own documents. For complex legal matters, please consult with qualified legal experts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;