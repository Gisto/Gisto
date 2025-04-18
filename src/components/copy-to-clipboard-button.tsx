import { Clipboard, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button.tsx';
import { copyToClipboard } from '@/lib/utils';

export const CopyToClipboardButton = ({ text }: { text: string }) => {
  const [copyActive, setCopyActive] = useState<boolean>(false);
  return (
    <Button
      variant="link"
      size="sm"
      data-testid="clipboard-button"
      onClick={() => {
        copyToClipboard(text);
        setCopyActive(true);
        setTimeout(() => setCopyActive(false), 2000);
      }}
    >
      {copyActive ? (
        <ClipboardCheck data-testid="clipboard-check-icon" className="text-success" />
      ) : (
        <Clipboard data-testid="clipboard-icon" />
      )}
    </Button>
  );
};
