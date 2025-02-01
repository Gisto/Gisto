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
      onClick={() => {
        copyToClipboard(text);
        setCopyActive(true);
        setTimeout(() => setCopyActive(false), 2000);
      }}
    >
      {copyActive ? <ClipboardCheck className="text-success" /> : <Clipboard />}
    </Button>
  );
};
