import React from 'react';
import { WaqfResponse } from '../types/responses';

interface ResponseFormatterProps {
  response: WaqfResponse;
  language: 'english' | 'urdu';
}

const ResponseFormatter: React.FC<ResponseFormatterProps> = ({ response, language }) => {
  const isUrdu = language === 'urdu';

  return (
    <div className={`${isUrdu ? 'text-right' : 'text-left'}`}>
      <div 
        className={`text-black leading-relaxed ${isUrdu ? 'font-arabic' : 'font-inter'}`}
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        {response.answer.split('\n').map((point, index) => (
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
      </div>
    </div>
  );
};

export default ResponseFormatter;
