import React from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Search = () => {
  const [filterType, setFilterType] = React.useState('text');
  const [value, setValue] = React.useState('');

  return (
    <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-auto border-0 focus:ring-0 focus:ring-offset-0">
          <div className="border text-xs px-1 py-0 rounded border-primary">
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">text</SelectItem>
          <SelectItem value="tag">tag</SelectItem>
          <SelectItem value="language">language</SelectItem>
        </SelectContent>
      </Select>
      <div className="w-px h-[1.5rem] bg-input"></div>
      <Input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search"
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};
