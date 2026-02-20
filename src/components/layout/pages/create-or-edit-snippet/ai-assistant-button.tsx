import { Sparkles } from 'lucide-react';
import React from 'react';

import { ActionType } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { generateAiResponse, AiApiError, isAiAvailable } from '@/lib/api/ai-api.ts';
import { t } from '@/lib/i18n';

interface AiAssistantButtonProps {
  state: {
    files: Array<{ content: string }>;
  };
  dispatch: React.ActionDispatch<[action: ActionType]>;
  tags: string[];
}

export const AiAssistantButton = ({ state, dispatch, tags }: AiAssistantButtonProps) => {
  if (!isAiAvailable()) {
    return null;
  }

  const generate = async () => {
    try {
      const codeContent = state.files.map((f) => f.content).join('\n');

      const prompt = [
        'Respond ONLY with a raw JSON object like this:',
        '{"description": "A short...", "tags": ["tag1", "tag2"]}',
        'Up to 3 tags.',
        'Tags should NOT include the # symbol - just plain tag names.',
        'Do not use code block formatting (no ```).',
        'Generate the shortest description possible based on the following code snippets:',
        codeContent,
        `Don't add existing tags. These already exist: ${tags.join(', ')}`,
      ].join('\n');

      const rawJson = await generateAiResponse({
        prompt,
      });

      const { description, tags: newTags } = JSON.parse(rawJson);

      dispatch({ type: 'SET_DESCRIPTION', payload: description });

      const normalizedExistingTags = tags
        .map((tag) => {
          return String(tag || '')
            .replace(/^#+/, '')
            .toLowerCase()
            .trim();
        })
        .filter((tag) => tag.length > 0);

      const tagsArray = Array.isArray(newTags) ? newTags : [];
      const normalizedNewTags = tagsArray
        .map((tag: unknown) => {
          const tagStr = String(tag || '').trim();
          return tagStr.replace(/^#+/, '').toLowerCase().trim();
        })
        .filter((tag: string) => tag.length > 0);

      const mergedTags = Array.from(new Set([...normalizedExistingTags, ...normalizedNewTags])).map(
        (tag: string) => `#${tag}`
      );

      dispatch({ type: 'SET_TAGS', payload: mergedTags });
    } catch (error) {
      console.error('AI error:', error);

      if (error instanceof AiApiError) {
        const providerName =
          error.provider === 'openrouter'
            ? 'OpenRouter'
            : error.provider === 'openai'
              ? 'OpenAI'
              : 'Gemini';
        toast.show({
          message: error.message,
          type: 'error',
          duration: 5000,
          title: `${providerName} API error`,
        });
      } else {
        toast.show({
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          type: 'error',
          duration: 5000,
          title: 'AI error',
        });
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" onClick={generate}>
            <Sparkles />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('pages.new.generateDescriptionAndTags')}</TooltipContent>
      </Tooltip>
    </div>
  );
};
