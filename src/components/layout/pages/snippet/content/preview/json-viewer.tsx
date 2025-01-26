import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { CopyToClipboardButton } from '@/components/copy-to-clipboard-button.tsx';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { cn } from '@/lib/utils.ts';

type JsonViewerProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
  className?: string;
};

type CollapsibleNodeProps = {
  label: string | number;
  data: unknown;
};

export const JsonViewer = ({ data, className }: JsonViewerProps) => {
  const renderValue = (key: string | number, value: unknown) => {
    if (value && typeof value === 'object') {
      return (
        <CollapsibleNode
          key={key}
          label={typeof key === 'number' ? `[${key}]` : key}
          data={value}
        />
      );
    }

    return (
      <div className={cn('ml-4', className)}>
        <span className="font-medium text-gray-500">
          {typeof key === 'number' ? `[${key}]` : key}:
        </span>{' '}
        <div className="inline-flex items-center gap-2">
          <span className="">{value?.toString()}</span> {nodeValue(value)}
        </div>
      </div>
    );
  };

  if (Array.isArray(data)) {
    return <div>{data.map((value, index) => renderValue(index, value))}</div>;
  }

  return <div>{Object.entries(data).map(([key, value]) => renderValue(key, value))}</div>;
};

const nodeValue = (value: unknown) => {
  if (value === null) {
    return <small className="-mt-2 text-sm">NULL</small>;
  }
  if (value?.toString() === '[]' || value?.toString() === '{}') {
    return null;
  }
  return value?.toString() ? <CopyToClipboardButton text={value?.toString()} /> : '""';
};

const CollapsibleNode = ({ label, data }: CollapsibleNodeProps) => {
  const settings = useStoreValue('settings');
  const [isOpen, setIsOpen] = useState(settings.jsonPreviewCollapsedByDefault);

  if (Array.isArray(data) && data.length === 0) {
    return <JsonViewer data={{ [label]: '[]' }} />;
  }

  if (Object.keys(data as unknown as Record<string, unknown>)?.length === 0) {
    return <JsonViewer data={{ [label]: '{}' }} />;
  }

  return (
    <div className="ml-4">
      <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <ChevronDown className="size-4 stroke-foreground" />
        ) : (
          <ChevronRight className="size-4  stroke-foreground" />
        )}
        <span className="ml-1 font-semibold">
          {typeof label === 'number' ? `[${label}]` : label}
        </span>
      </div>
      {isOpen && (
        <div className="ml-2 border-l pl-2">
          {Array.isArray(data)
            ? data.map((value, index) => <JsonViewer key={index} data={{ [index]: value }} />)
            : Object.entries(data as unknown as Record<string, unknown>).map(([key, value]) => (
                <JsonViewer key={key} data={{ [key]: value }} />
              ))}
        </div>
      )}
    </div>
  );
};
