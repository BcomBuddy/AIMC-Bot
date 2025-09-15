import React, { useRef, useState } from 'react';
import { Plus, Upload, File, X, AlertCircle } from 'lucide-react';
import { DocumentProcessor, ProcessedDocument } from '../services/documentProcessor';

interface DocumentUploadProps {
  onDocumentProcessed: (document: ProcessedDocument) => void;
  language: 'english' | 'urdu';
  disabled?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onDocumentProcessed, 
  language, 
  disabled = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<ProcessedDocument | null>(null);
  const [error, setError] = useState<string>('');
  const isUrdu = language === 'urdu';

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    
    // Validate file
    const validation = DocumentProcessor.validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setIsProcessing(true);

    try {
      const processedDoc = await DocumentProcessor.processFile(file);
      setUploadedDoc(processedDoc);
      onDocumentProcessed(processedDoc);
    } catch (error) {
      console.error('Document processing failed:', error);
      setError(isUrdu 
        ? 'دستاویز پروسیس کرنے میں خرابی ہوئی'
        : 'Failed to process document'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveDocument = () => {
    setUploadedDoc(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    if (!disabled && !isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isProcessing}
      />

      {/* Upload Button */}
      <button
        onClick={triggerFileSelect}
        disabled={disabled || isProcessing}
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          disabled || isProcessing
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 shadow-lg hover:shadow-xl'
        }`}
        title={isUrdu ? 'دستاویز اپ لوڈ کریں' : 'Upload Document'}
      >
        {isProcessing ? (
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        )}
      </button>

      {/* Document Status */}
      {uploadedDoc && (
        <div className="absolute bottom-14 left-0 bg-white border-2 border-teal-200 rounded-lg p-2 sm:p-3 shadow-lg min-w-48 sm:min-w-64 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4 text-teal-600" />
              <span className="text-xs sm:text-sm font-medium text-teal-900 truncate max-w-32 sm:max-w-40">
                {uploadedDoc.filename}
              </span>
            </div>
            <button
              onClick={handleRemoveDocument}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-teal-600 mt-1">
            {isUrdu ? 'دستاویز لوڈ ہو گئی' : 'Document loaded'}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-14 left-0 bg-red-50 border-2 border-red-200 rounded-lg p-2 sm:p-3 shadow-lg min-w-48 sm:min-w-64 z-10">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs sm:text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      {!uploadedDoc && !error && !disabled && (
        <div className="absolute bottom-14 left-0 bg-teal-50 border-2 border-teal-200 rounded-lg p-2 sm:p-3 shadow-lg min-w-48 sm:min-w-64 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-2">
            <Upload className="w-4 h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-700">
              {isUrdu 
                ? 'PDF فائل اپ لوڈ کریں'
                : 'Upload PDF file'
              }
            </span>
          </div>
          <p className="text-xs text-teal-600 mt-1">
            {isUrdu ? 'زیادہ سے زیادہ 10MB' : 'Max 10MB'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;