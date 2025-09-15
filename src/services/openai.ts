import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private static instance: OpenAIService;
  private conversationHistory: Map<string, ChatMessage[]> = new Map();

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private getSystemPrompt(language: 'english' | 'urdu', hasDocument: boolean = false): string {
    const basePrompt = language === 'urdu' 
      ? `آپ ایک اسلامی عالم کے معاون ہیں۔ آپ کو اسلامی تعلیمات، وقف، فقہ، اور دیگر مذہبی امور کے بارے میں سوالات کا جواب دینا ہے۔ 
         ہمیشہ درست، احترام سے بھرے، اور جامع جوابات فراہم کریں۔ قرآن اور حدیث کی روشنی میں جواب دیں۔
         ${hasDocument ? 'اگر صارف نے کوئی دستاویز فراہم کی ہے تو اس کے مطابق جواب دیں۔' : ''}
         ہمیشہ اردو میں جواب دیں۔`
      : `You are an Islamic scholar assistant specializing in Islamic teachings, Waqf, jurisprudence, and religious matters.
         Always provide accurate, respectful, and comprehensive answers based on Quran and Hadith.
         ${hasDocument ? 'If the user has provided a document, answer based on that context as well.' : ''}
         Always respond in English with proper Islamic terminology.`;

    return basePrompt;
  }

  async sendMessage(
    message: string, 
    language: 'english' | 'urdu', 
    sessionId: string,
    documentContext?: string
  ): Promise<string> {
    try {
      let history = this.conversationHistory.get(sessionId) || [];
      
      // Add system prompt if this is the first message or if document context is provided
      if (history.length === 0 || documentContext) {
        const systemPrompt = this.getSystemPrompt(language, !!documentContext);
        const systemMessage: ChatMessage = {
          role: 'system',
          content: documentContext 
            ? `${systemPrompt}\n\nDocument Context:\n${documentContext}`
            : systemPrompt
        };
        
        if (documentContext) {
          // If new document, reset conversation with new context
          history = [systemMessage];
        } else if (history.length === 0) {
          history = [systemMessage];
        }
      }

      // Add user message
      history.push({
        role: 'user',
        content: message
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: history,
        temperature: 0.3,
        max_tokens: 1000,
      });

      const assistantMessage = response.choices[0]?.message?.content || 
        (language === 'urdu' ? 'معذرت، میں آپ کے سوال کا جواب نہیں دے سکا۔' : 'Sorry, I could not process your question.');

      // Add assistant response to history
      history.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Keep only last 10 messages to manage token limits
      if (history.length > 21) { // 1 system + 20 messages
        history = [history[0], ...history.slice(-20)];
      }

      this.conversationHistory.set(sessionId, history);
      return assistantMessage;

    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error instanceof Error && error.message.includes('rate_limit')) {
        return language === 'urdu' 
          ? 'معذرت، فی الوقت سروس دستیاب نہیں ہے۔ براہ کرم کچھ دیر بعد کوشش کریں۔'
          : 'Sorry, the service is currently unavailable due to rate limits. Please try again later.';
      }
      
      return language === 'urdu'
        ? 'معذرت، کوئی تکنیکی خرابی ہوئی ہے۔ براہ کرم دوبارہ کوشش کریں۔'
        : 'Sorry, there was a technical error. Please try again.';
    }
  }

  clearConversation(sessionId: string): void {
    this.conversationHistory.delete(sessionId);
  }
}

export default OpenAIService.getInstance();