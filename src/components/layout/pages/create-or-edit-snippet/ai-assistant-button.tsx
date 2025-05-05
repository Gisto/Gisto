import { Sparkles } from 'lucide-react';
import React from 'react';

import { ActionType } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { SimpleTooltip } from '@/components/simple-tooltip.tsx';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button.tsx';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface AiAssistantButtonProps {
  state: {
    files: Array<{ content: string }>;
  };
  dispatch: React.ActionDispatch<[action: ActionType]>;
  tags: string[];
}

export const AiAssistantButton = ({ state, dispatch, tags }: AiAssistantButtonProps) => {
  const { geminiApiKey } = useStoreValue('settings');

  if (!geminiApiKey) {
    return null;
  }

  const generate = async () => {
    try {
      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: [
                    'Respond ONLY with a raw JSON object like this:',
                    '{"description": "A short...", "tags": ["tag1", "tag2"]}',
                    'Up to 3 tags.',
                    'Do not use code block formatting (no ```).',
                    'Generate the shortest description possible based on the following code snippets:',
                    state.files.map((f) => f.content).join('\n'),
                    `Don't add existing tags. These already exist: ${tags.join(', ')}`,
                  ].join('\n'),
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message =
          errorBody?.error?.message || `HTTP ${response.status} ${response.statusText}`;

        toast.show({
          message,
          type: 'error',
          duration: 5000,
          title: 'Gemini API error',
        });

        throw new Error(`Gemini API error: ${message}`);
      }

      const res = await response.json();

      let rawJson = res.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

      rawJson = rawJson
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/```$/, '')
        .trim();

      const { description, tags: newTags } = JSON.parse(rawJson);

      dispatch({ type: 'SET_DESCRIPTION', payload: description });
      newTags.forEach((tag: string) => dispatch({ type: 'ADD_TAG', payload: `#${tag}` }));
    } catch (error) {
      console.error('AI error:', error);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={generate}>
      <SimpleTooltip content={t('pages.new.generateDescriptionAndTags')}>
        <Sparkles />
      </SimpleTooltip>
    </Button>
  );
};
