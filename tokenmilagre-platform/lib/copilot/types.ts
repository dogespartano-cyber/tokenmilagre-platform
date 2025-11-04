/**
 * Types for Gemini 2.5 Pro Copilot System
 */

// Tool Permission Levels
export enum ToolPermissionLevel {
  AUTO = 'auto',                    // Executa automaticamente (leitura)
  CONFIRM = 'confirm',              // Pede confirmação (escrita simples)
  CONFIRM_TWICE = 'confirm_twice'   // Pede 2x confirmação (ações destrutivas)
}

// Tool Status
export enum ToolExecutionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXECUTING = 'executing',
  EXECUTED = 'executed',
  FAILED = 'failed'
}

// Tool Parameter Definition
export interface ToolParameter {
  type: string;
  description?: string;
  enum?: string[];
  items?: ToolParameter;
  properties?: Record<string, ToolParameter>;
  required?: string[];
}

// Tool Definition (Gemini Function Declaration)
export interface CopilotTool {
  name: string;
  description: string;
  permission: ToolPermissionLevel;
  parameters: {
    type: 'object';
    properties: Record<string, ToolParameter>;
    required?: string[];
  };
  execute: (args: any, context?: ToolExecutionContext) => Promise<ToolExecutionResult>;
}

// Tool Execution Context
export interface ToolExecutionContext {
  userId: string;
  userName: string;
  userRole: string;
  sessionId: string;
  timestamp: Date;
}

// Tool Execution Result
export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  metadata?: Record<string, any>;
}

// Copilot Message
export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

// Tool Call (Function Call from Gemini)
export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, any>;
  status: ToolExecutionStatus;
  requiresConfirmation: boolean;
  confirmationMessage?: string;
}

// Tool Result
export interface ToolResult {
  toolCallId: string;
  name: string;
  result: ToolExecutionResult;
  executedAt: Date;
}

// Copilot Activity (for audit log)
export interface CopilotActivity {
  id: string;
  userId: string;
  action: string;
  parameters: string;
  result?: string;
  status: ToolExecutionStatus;
  requiresConfirmation: boolean;
  confirmed: boolean;
  confirmedAt?: Date;
  createdAt: Date;
}

// Gemini API Types
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

export interface GeminiPart {
  text?: string;
  functionCall?: {
    name: string;
    args: Record<string, any>;
  };
  functionResponse?: {
    name: string;
    response: {
      content: any;
    };
  };
}

export interface GeminiFunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface GeminiGenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  candidateCount?: number;
}

export interface GeminiRequest {
  contents: GeminiMessage[];
  tools?: {
    functionDeclarations: GeminiFunctionDeclaration[];
  }[];
  systemInstruction?: {
    parts: { text: string }[];
  };
  generationConfig?: GeminiGenerationConfig;
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: GeminiPart[];
      role: string;
    };
    finishReason: string;
  }[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

// System Statistics (for get_statistics tool)
export interface SystemStatistics {
  articles: {
    total: number;
    published: number;
    drafts: number;
    byType: {
      news: number;
      educational: number;
    };
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  users: {
    total: number;
    byRole: {
      admin: number;
      editor: number;
      viewer: number;
    };
    activeToday: number;
  };
  resources: {
    total: number;
    byCategory: Record<string, number>;
  };
  performance: {
    avgArticleScore: number;
    articlesNeedingReview: number;
    lowScoreArticles: number;
  };
  system: {
    lastBackup?: Date;
    dbSize?: string;
    apiQuotas?: {
      gemini?: string;
      perplexity?: string;
    };
  };
}
