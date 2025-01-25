import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

interface JsonViewerProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export const JsonViewer = ({ data }: JsonViewerProps) => {
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
      <div className="ml-4">
        <span className="font-medium text-gray-500">
          {typeof key === 'number' ? `[${key}]` : key}:
        </span>{' '}
        <span className="">{value?.toString()}</span>
      </div>
    );
  };

  if (Array.isArray(data)) {
    return (
      <div className="p-4  rounded-md">{data.map((value, index) => renderValue(index, value))}</div>
    );
  }

  return (
    <div className="p-2 rounded-md">
      {Object.entries(data).map(([key, value]) => renderValue(key, value))}
    </div>
  );
};

interface CollapsibleNodeProps {
  label: string | number;
  data: unknown;
}

const CollapsibleNode: React.FC<CollapsibleNodeProps> = ({ label, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ml-4">
      <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="ml-1 font-semibold">
          {typeof label === 'number' ? `[${label}]` : label}
        </span>
      </div>
      {isOpen && (
        <div className="ml-4 border-l pl-2">
          {Array.isArray(data)
            ? data.map((value, index) => <JsonViewer key={index} data={{ [index]: value }} />)
            : Object.entries(data).map(([key, value]) => (
                <JsonViewer key={key} data={{ [key]: value }} />
              ))}
        </div>
      )}
    </div>
  );
};
