# Bilingual Islamic Assistant with RAG

This application is an AI-powered Islamic assistant that provides answers in both English and Urdu using Retrieval-Augmented Generation (RAG). It processes questions about Islamic teachings and provides responses based on the relevant language-specific documents.

## Features

- Bilingual support (English and Urdu)
- Document-based responses using RAG
- Real-time chat interface
- Document upload capability
- Language switching

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory with the following:
```
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_LANGSMITH_API_KEY=your-langsmith-api-key
VITE_LANGSMITH_TRACING=true
```

3. Add PDF documents:
- Place your English Islamic document in `public/english_document.pdf`
- Place your Urdu Islamic document in `public/urdu_document.pdf`

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Select your preferred language (English or Urdu)
2. Type your question about Islamic teachings
3. The system will provide an answer based on the relevant language document
4. You can switch languages at any time using the language selection button

## Technical Details

- Uses LangChain for RAG implementation
- OpenAI's GPT-4 Turbo for text generation
- ChromaDB for vector storage
- React with TypeScript for the frontend
- Tailwind CSS for styling

## Important Notes

- The system uses document-based responses, ensuring answers are grounded in the provided Islamic texts
- Responses are generated in the selected language
- For complex religious matters, always consult qualified scholars
