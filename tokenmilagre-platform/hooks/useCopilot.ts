/**
 * useCopilot Hook
 * Manages Copilot chat state and communication
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, any>;
  status: string;
  requiresConfirmation: boolean;
}

export interface ToolResult {
  toolCallId: string;
  name: string;
  result: any;
  executedAt: Date;
}

export interface ConfirmationData {
  activityId: string;
  toolName: string;
  parameters: Record<string, any>;
  message: string;
  permissionLevel: string;
}

export function useCopilot() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<ConfirmationData | null>(null);
  const messagesRef = useRef<CopilotMessage[]>([]);

  // Sync ref with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /**
   * Send message to Copilot
   */
  const sendMessage = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);

      // Add user message
      const userMessage: CopilotMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date()
      };

      const updatedMessages = [...messagesRef.current, userMessage];
      setMessages(updatedMessages);

      // Call API
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: updatedMessages,
          executeTools: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao enviar mensagem');
      }

      const data = await response.json();

      // Check if requires confirmation
      if (data.requiresConfirmation) {
        setPendingConfirmation(data.confirmationData);

        // Add assistant message explaining confirmation needed
        const assistantMessage: CopilotMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.confirmationData.message,
          timestamp: new Date()
        };

        setMessages([...updatedMessages, assistantMessage]);
        return;
      }

      // Add assistant response
      const assistantMessage: CopilotMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        toolCalls: data.toolCalls,
        toolResults: data.toolResults
      };

      setMessages([...updatedMessages, assistantMessage]);

    } catch (err: any) {
      console.error('[useCopilot] Error:', err);
      setError(err.message || 'Erro ao processar mensagem');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Approve pending action
   */
  const approveAction = useCallback(async () => {
    if (!pendingConfirmation) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/copilot/execute-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activityId: pendingConfirmation.activityId,
          action: 'approve'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao executar ação');
      }

      const data = await response.json();

      // Add result message
      const resultMessage: CopilotMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.result.message || 'Ação executada com sucesso!',
        timestamp: new Date()
      };

      setMessages([...messagesRef.current, resultMessage]);
      setPendingConfirmation(null);

    } catch (err: any) {
      console.error('[useCopilot] Error approving action:', err);
      setError(err.message || 'Erro ao executar ação');
    } finally {
      setLoading(false);
    }
  }, [pendingConfirmation]);

  /**
   * Reject pending action
   */
  const rejectAction = useCallback(async () => {
    if (!pendingConfirmation) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/copilot/execute-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activityId: pendingConfirmation.activityId,
          action: 'reject'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao rejeitar ação');
      }

      // Add rejection message
      const rejectionMessage: CopilotMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: '❌ Ação rejeitada pelo usuário.',
        timestamp: new Date()
      };

      setMessages([...messagesRef.current, rejectionMessage]);
      setPendingConfirmation(null);

    } catch (err: any) {
      console.error('[useCopilot] Error rejecting action:', err);
      setError(err.message || 'Erro ao rejeitar ação');
    } finally {
      setLoading(false);
    }
  }, [pendingConfirmation]);

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setPendingConfirmation(null);
    setError(null);
  }, []);

  /**
   * Add system message
   */
  const addSystemMessage = useCallback((content: string) => {
    const systemMessage: CopilotMessage = {
      id: `system_${Date.now()}`,
      role: 'system',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, systemMessage]);
  }, []);

  return {
    messages,
    loading,
    error,
    pendingConfirmation,
    sendMessage,
    approveAction,
    rejectAction,
    clearMessages,
    addSystemMessage
  };
}
