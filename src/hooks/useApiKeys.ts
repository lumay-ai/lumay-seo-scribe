import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';

export type AIProvider = 'gemini' | 'openai' | 'openrouter' | 'anthropic' | 'lovable';

export interface UserApiKey {
  id: string;
  user_id: string;
  provider: AIProvider;
  api_key: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateApiKeyData {
  provider: AIProvider;
  api_key: string;
  label?: string;
}

export interface UpdateApiKeyData {
  id: string;
  api_key?: string;
  label?: string;
  is_active?: boolean;
}

export const PROVIDER_INFO: Record<AIProvider, { name: string; description: string; models: string[] }> = {
  lovable: {
    name: 'Lovable AI (Built-in)',
    description: 'Pre-configured AI - no API key needed',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gpt-5', 'gpt-5-mini'],
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Google AI Studio API key',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'],
  },
  openai: {
    name: 'OpenAI',
    description: 'OpenAI platform API key',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  openrouter: {
    name: 'OpenRouter',
    description: 'Access multiple models via OpenRouter',
    models: ['anthropic/claude-3.5-sonnet', 'google/gemini-pro', 'openai/gpt-4o', 'meta-llama/llama-3.1-70b'],
  },
  anthropic: {
    name: 'Anthropic Claude',
    description: 'Anthropic API key',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
  },
};

export function useApiKeys() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading, error } = useQuery({
    queryKey: ['user-api-keys', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserApiKey[];
    },
    enabled: !!user?.id,
  });

  const createApiKey = useMutation({
    mutationFn: async (data: CreateApiKeyData) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data: result, error } = await supabase
        .from('user_api_keys')
        .insert({
          user_id: user.id,
          provider: data.provider,
          api_key: data.api_key,
          label: data.label || null,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-api-keys'] });
      toast.success('API key added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add API key: ${error.message}`);
    },
  });

  const updateApiKey = useMutation({
    mutationFn: async (data: UpdateApiKeyData) => {
      const { id, ...updates } = data;
      
      const { data: result, error } = await supabase
        .from('user_api_keys')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-api-keys'] });
      toast.success('API key updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update API key: ${error.message}`);
    },
  });

  const deleteApiKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-api-keys'] });
      toast.success('API key deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete API key: ${error.message}`);
    },
  });

  const getActiveKeyForProvider = (provider: AIProvider): UserApiKey | undefined => {
    return apiKeys.find(key => key.provider === provider && key.is_active);
  };

  const getAvailableProviders = (): AIProvider[] => {
    const configuredProviders = apiKeys
      .filter(key => key.is_active)
      .map(key => key.provider);
    
    return ['lovable', ...configuredProviders.filter(p => p !== 'lovable')];
  };

  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; error?: string } | null>(null);

  const validateApiKey = useCallback(async (provider: AIProvider, api_key: string) => {
    if (provider === 'lovable') {
      setValidationResult({ valid: true });
      return { valid: true };
    }
    setIsValidating(true);
    setValidationResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('validate-api-key', {
        body: { provider, api_key },
      });
      if (error) throw error;
      const result = data as { valid: boolean; error?: string };
      setValidationResult(result);
      if (result.valid) {
        toast.success('API key is valid!');
      } else {
        toast.error(result.error || 'Invalid API key');
      }
      return result;
    } catch (e: any) {
      const result = { valid: false, error: e.message || 'Validation failed' };
      setValidationResult(result);
      toast.error(result.error);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const resetValidation = useCallback(() => setValidationResult(null), []);

  return {
    apiKeys,
    isLoading,
    error,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    getActiveKeyForProvider,
    getAvailableProviders,
    validateApiKey,
    isValidating,
    validationResult,
    resetValidation,
  };
}
