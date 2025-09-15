import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { loadPDFFromURL } from "./pdfLoader";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RetrievalQAChain } from "langchain/chains";

// OpenAI API key configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "sk-proj-ezkgz1hLkQy_GwFsccz-DbFb_r1ik0Zr3PXA7W4LWBW33dHYDwyyxwwh8EaOAv7T1jf3cmT60T3BlbkFJcibH7lR0Ai74KYYPHmbNMVXvz96ouV0hWuodAJrV-SrSmDuk8TJVPu5h1ocFAFxHlPYqgk4SQA";

// Debug: Log API key status
console.log("Environment variable VITE_OPENAI_API_KEY:", import.meta.env.VITE_OPENAI_API_KEY ? "Set" : "Not set");
console.log("Using API key:", OPENAI_API_KEY.substring(0, 20) + "...");

// Configure OpenAI globally
import { OpenAI } from "openai";
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side use
});

// Initialize components lazily
let llm: ChatOpenAI | null = null;
let embeddings: OpenAIEmbeddings | null = null;

function getLLM() {
  if (!llm) {
    llm = new ChatOpenAI({
      modelName: "gpt-4-1106-preview",
      temperature: 0,
      openAIApiKey: OPENAI_API_KEY,
      configuration: {
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      }
    });
  }
  return llm;
}

function getEmbeddings() {
  if (!embeddings) {
    embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002",
      openAIApiKey: OPENAI_API_KEY,
      configuration: {
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      }
    });
  }
  return embeddings;
}

// Text splitter configuration
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 150,
});

// Prompt templates
const englishPromptTemplate = ChatPromptTemplate.fromTemplate(`
You are a Waqf (Islamic endowment) specialist assistant. You only answer questions about Waqf.

STRICT RULES:
- Responses must be 3-5 bullet points only
- Each bullet point should be 1-2 sentences maximum
- Answer ONLY what is asked, no additional information
- Do not discuss topics other than Waqf
- Keep responses concise and clear
- Always use the provided context
- If context doesn't contain relevant information, say so clearly

Context:
{context}

Question: {query}

Instructions:
- Answer in English
- Be concise but thorough
- Use bullet points
- Focus on information from the context
- If context doesn't contain relevant information, say so

Answer:`);

const urduPromptTemplate = ChatPromptTemplate.fromTemplate(`
آپ ایک وقف کے ماہر معاون ہیں۔ آپ کو صرف وقف (اسلامی وقف) کے بارے میں سوالات کا جواب دینا ہے۔

سخت ہدایات:
- جوابات 3-5 بلٹ پوائنٹس میں ہوں
- ہر بلٹ پوائنٹ 1-2 جملے کا ہو
- صرف سوال کا جواب دیں، اضافی معلومات نہ دیں
- وقف کے علاوہ کسی اور موضوع پر بات نہ کریں
- جوابات مختصر اور واضح ہوں
- ہمیشہ دیے گئے سیاق و سباق کا استعمال کریں
- اگر سیاق و سباق میں متعلقہ معلومات نہیں ہیں تو واضح طور پر بتائیں

سیاق و سباق:
{context}

سوال: {query}

ہدایات:
- اردو میں جواب دیں
- مختصر لیکن جامع جواب دیں
- بلٹ پوائنٹس استعمال کریں
- سیاق و سباق سے معلومات پر توجہ دیں
- اگر سیاق و سباق میں متعلقہ معلومات نہیں ہیں تو یہ بتائیں

جواب:`);

class RAGService {
  private englishVectorStore: MemoryVectorStore | null = null;
  private urduVectorStore: MemoryVectorStore | null = null;
  private initialized: boolean = false;

  async initialize() {
    if (this.initialized) return;

    try {
      console.log("Starting RAG service initialization...");

      let englishSplits, urduSplits;

      // Load English PDF
      console.log("Loading English document...");
      try {
        const englishDocs = await loadPDFFromURL("/english_document.pdf");
        console.log("English document loaded successfully:", englishDocs.length, "pages");
        englishSplits = await textSplitter.splitDocuments(englishDocs);
        console.log("English document split into", englishSplits.length, "chunks");
      } catch (error) {
        console.error("Error loading English document:", error);
        throw new Error(`Failed to load English document: ${error.message}`);
      }

      // Load Urdu PDF
      console.log("Loading Urdu document...");
      try {
        const urduDocs = await loadPDFFromURL("/urdu_document.pdf");
        console.log("Urdu document loaded successfully:", urduDocs.length, "pages");
        urduSplits = await textSplitter.splitDocuments(urduDocs);
        console.log("Urdu document split into", urduSplits.length, "chunks");
      } catch (error) {
        console.error("Error loading Urdu document:", error);
        throw new Error(`Failed to load Urdu document: ${error.message}`);
      }

      // Create vector stores
      this.englishVectorStore = await MemoryVectorStore.fromDocuments(
        englishSplits,
        getEmbeddings()
      );

      this.urduVectorStore = await MemoryVectorStore.fromDocuments(
        urduSplits,
        getEmbeddings()
      );

      this.initialized = true;
      console.log("RAG Service initialized successfully");
    } catch (error) {
      console.error("Error initializing RAG service:", error);
      // Convert error to a more informative message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`RAG Service initialization failed: ${errorMessage}. Please ensure PDF files are properly placed in the public folder and are accessible.`);
    }
  }

  async getAnswer(question: string, language: 'english' | 'urdu'): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    const vectorStore = language === 'english' ? this.englishVectorStore : this.urduVectorStore;
    const promptTemplate = language === 'english' ? englishPromptTemplate : urduPromptTemplate;

    if (!vectorStore) {
      throw new Error(`Vector store not initialized for ${language}`);
    }

    try {
      const chain = RetrievalQAChain.fromLLM(
        getLLM(),
        vectorStore.asRetriever(),
        {
          prompt: promptTemplate,
          returnSourceDocuments: true,
        }
      );

      const response = await chain.call({
        query: question,
      });

      return response.text;
    } catch (error) {
      console.error(`Error getting ${language} answer:`, error);
      throw error;
    }
  }

  async getBilingualAnswer(question: string): Promise<{
    english: string;
    urdu: string;
  }> {
    const [englishResponse, urduResponse] = await Promise.all([
      this.getAnswer(question, 'english'),
      this.getAnswer(question, 'urdu'),
    ]);

    return {
      english: englishResponse,
      urdu: urduResponse,
    };
  }
}

export const ragService = new RAGService();
