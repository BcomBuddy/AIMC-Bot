import React, { useState, useRef, useEffect } from 'react';
// Import icons individually to reduce bundle size
import Send from 'lucide-react/dist/esm/icons/send';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import User from 'lucide-react/dist/esm/icons/user';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Loader from 'lucide-react/dist/esm/icons/loader';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import DocumentUpload from './DocumentUpload';
import ResponseFormatter from './ResponseFormatter';
import { ragService } from '../services/ragService';
import { ProcessedDocument } from '../services/documentProcessor';
import { WaqfResponse } from '../types/responses';

interface Message {
  id: string;
  content: string | React.ReactNode;
  sender: 'user' | 'bot';
  timestamp: Date;
  hasDocument?: boolean;
}

interface ChatInterfaceProps {
  language: 'english' | 'urdu';
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<ProcessedDocument | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isUrdu = language === 'urdu';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const typeText = (text: string, callback: (finalText: string) => void) => {
    let index = 0;
    setStreamingMessage('');
    setIsStreaming(true);
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setStreamingMessage(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsStreaming(false);
        callback(text);
      }
    }, 20); // Adjust speed here (lower = faster)
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    // Add welcome message
      const welcomeMessage: Message = {
      id: '1',
      content: isUrdu 
        ? 'السلام علیکم! میں اے آئی ایم سی معاون ہوں۔ میں آپ کو سپریم کورٹ کے وقف ترمیمی بل کے فیصلے کے بارے میں معلومات فراہم کر سکتا ہوں۔ آپ فیصلے کے بارے میں سوال کر سکتے ہیں یا اپنی دستاویزات اپ لوڈ کر کے ان کے ساتھ بات چیت کر سکتے ہیں۔'
        : 'Welcome! I am the AIMC Assistant. I can help you get information about the Supreme Court judgment on the Waqf Amendment Bill. You can ask questions about the judgment or upload your own documents to chat with them.',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [isUrdu]);

  const handleDocumentProcessed = (document: ProcessedDocument) => {
    setCurrentDocument(document);
    
    const documentMessage: Message = {
      id: `doc_${Date.now()}`,
      content: isUrdu 
        ? `دستاویز "${document.filename}" کامیابی سے لوڈ ہو گئی۔ اب آپ اس کے بارے میں سوال کر سکتے ہیں۔`
        : `Document "${document.filename}" has been successfully loaded. You can now ask questions about it.`,
      sender: 'bot',
      timestamp: new Date(),
      hasDocument: true
    };
    
    setMessages(prev => [...prev, documentMessage]);
  };
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      hasDocument: !!currentDocument
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await ragService.getAnswer(messageToSend, language);
      
      // Start typing effect
      setIsLoading(false);
      typeText(response, (finalText) => {
        // Create a mock WaqfResponse for the ResponseFormatter
        const waqfResponse: WaqfResponse = {
          answer: finalText,
          context: ['Supreme Court Judgment on Waqf Amendment Bill'],
          metadata: {
            confidence: 0.95,
            sources: ['Waqf Amendment Bill Document', 'Supreme Court Judgment']
          }
        };
        
        const formattedResponse = (
          <ResponseFormatter
            response={waqfResponse}
            language={language}
          />
        );
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: formattedResponse,
          sender: 'bot',
          timestamp: new Date(),
          hasDocument: !!currentDocument
        };
        
        setMessages(prev => [...prev, botMessage]);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Extract meaningful error message
      const errorDetails = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Detailed error:', errorDetails);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: isUrdu 
          ? `معذرت، کوئی تکنیکی خرابی ہوئی ہے: ${errorDetails}۔ براہ کرم دوبارہ کوشش کریں۔`
          : `Sorry, there was a technical error: ${errorDetails}. Please try again.`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-teal-600">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-1 sm:space-x-2 text-teal-700 hover:text-teal-900 transition-colors p-2 rounded-lg hover:bg-teal-50"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">{isUrdu ? 'واپس' : 'Back'}</span>
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                     <h1 className="text-lg sm:text-xl font-bold text-teal-900">
                       {isUrdu ? 'اے آئی ایم سی معاون' : 'AIMC Assistant'}
                     </h1>
                     <p className="text-xs sm:text-sm text-teal-600">
                       {isUrdu ? 'وقف ترمیمی بل - سپریم کورٹ فیصلہ' : 'Supreme Court Judgment on Waqf Amendment Bill'}
                     </p>
              </div>
            </div>
            
            <div className="w-8 sm:w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className={`max-w-4xl mx-auto space-y-4 sm:space-y-6 ${isUrdu ? 'pl-2 sm:pl-4 pr-0' : 'pr-2 sm:pr-4 pl-0'}`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 sm:space-x-3 ${
                message.sender === 'user' || isUrdu ? 'justify-end' : 'justify-start'
              } ${isUrdu ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? message.hasDocument 
                    ? 'bg-gradient-to-br from-purple-400 to-purple-500'
                    : 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                  : message.hasDocument
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600'
                    : 'bg-gradient-to-br from-teal-600 to-emerald-600'
              }`}>
                {                        message.sender === 'user' ? (
                          message.hasDocument ? <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        ) : (
                          message.hasDocument ? <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        )}
              </div>
              
                     <div className={`max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-md ${
                       message.sender === 'user'
                         ? message.hasDocument
                           ? 'bg-gradient-to-br from-purple-400 to-purple-500 text-white'
                           : 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
                         : message.hasDocument
                           ? 'bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-900 border-2 border-indigo-200'
                           : 'bg-white text-teal-900 border-2 border-teal-100'
                     } ${isUrdu ? 'text-right mr-0 ml-auto' : 'text-left'}`}>
                       <div className="leading-relaxed" dir={isUrdu ? 'rtl' : 'ltr'}>
                         {typeof message.content === 'string' ? (
                           <p>{message.content}</p>
                         ) : (
                           message.content
                         )}
                       </div>
                <p className={`text-xs mt-2 opacity-75 ${
                  message.sender === 'user' 
                    ? message.hasDocument ? 'text-purple-100' : 'text-yellow-100'
                    : message.hasDocument ? 'text-indigo-500' : 'text-teal-500'
                } ${isUrdu ? 'text-left' : 'text-right'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
                 {isLoading && !isStreaming && (
                   <div className="flex items-start space-x-3 justify-start">
                     <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center">
                       <Bot className="w-5 h-5 text-white" />
                     </div>
                     <div className="bg-white text-teal-900 border-2 border-teal-100 px-6 py-4 rounded-2xl shadow-md">
                       <div className="flex items-center space-x-2">
                         <Loader className="w-4 h-4 animate-spin text-teal-600" />
                         <span className="text-sm text-teal-600">
                           {isUrdu ? 'جواب تیار کیا جا رہا ہے...' : 'Thinking...'}
                         </span>
                       </div>
                     </div>
                   </div>
                 )}

                 {isStreaming && (
                   <div className="flex items-start space-x-3 justify-start">
                     <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center">
                       <Bot className="w-5 h-5 text-white" />
                     </div>
                     <div className="bg-white text-teal-900 border-2 border-teal-100 px-6 py-4 rounded-2xl shadow-md max-w-xs lg:max-w-md xl:max-w-lg">
                       <div className="text-black leading-relaxed">
                         {streamingMessage.split('\n').map((point, index) => (
                           point.trim() && (
                             <div key={index} className="flex items-start mb-3 gap-2">
                               {point.startsWith('•') ? (
                                 <>
                                   <span className="text-black mt-1">•</span>
                                   <p className="text-black">{point.replace('•', '').trim()}</p>
                                 </>
                               ) : (
                                 <p className="text-black">{point}</p>
                               )}
                             </div>
                           )
                         ))}
                         <span className="typing-cursor">|</span>
                       </div>
                     </div>
                   </div>
                 )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-teal-100 px-2 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {/* Current Document Indicator */}
          {currentDocument && (
            <div className="mb-4 p-2 sm:p-3 bg-teal-50 border-2 border-teal-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span className="text-xs sm:text-sm font-medium text-teal-900 truncate max-w-32 sm:max-w-40">
                    {isUrdu ? 'فعال دستاویز:' : 'Active Document:'} {currentDocument.filename}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentDocument(null)}
                  className="text-teal-600 hover:text-teal-800 text-xs sm:text-sm font-medium"
                >
                  {isUrdu ? 'ہٹائیں' : 'Remove'}
                </button>
              </div>
            </div>
          )}
          
          <div className={`flex items-end ${isUrdu ? 'space-x-2 sm:space-x-4 space-x-reverse flex-row-reverse' : 'space-x-2 sm:space-x-4'} group`}>
            {/* Document Upload */}
                   <DocumentUpload
                     onDocumentProcessed={handleDocumentProcessed}
                     language={language}
                     disabled={isLoading || isStreaming}
                   />
            
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question in English..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-2 border-teal-200 focus:border-teal-500 focus:outline-none resize-none shadow-md transition-all duration-200 text-left text-sm sm:text-base"
                dir="ltr"
                rows={1}
                style={{ minHeight: '50px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-teal-600">
              {isUrdu 
                ? 'نوٹ: یہ اے آئی ایم سی معاون سپریم کورٹ کے فیصلے کی معلومات فراہم کرتا ہے۔ آپ اپنی دستاویزات بھی اپ لوڈ کر سکتے ہیں۔ قانونی مشورے کے لیے براہ کرم قانونی ماہرین سے رجوع کریں۔'
                : 'Note: This AIMC assistant provides information about the Supreme Court judgment. You can also upload your own documents to chat with them. For legal advice, please consult legal experts.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;