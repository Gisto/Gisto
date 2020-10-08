import React from 'react';

export interface INotification {
  title?: string;
  body: string;
  actions: Array<{
    title: string;
    action: () => void;
  }>;
  theme: {
    lightText: string;
  };
  position: string;
  type?: string;
  options: object;
}

export interface ISnippet {
  id: string;
  language: string;
  filename?: string;
  name?: string;
  type?: any;
  description?: string | undefined;
  url?: string;
  files: object[];
  size: number;
  fork_of: string;
  history: object[];
  public: boolean;
  html_url: string;
  comments: null | object[];
  created_at: number;
  updated_at: number;
  lastModified: number;
  tags: string[];
  truncated: boolean;
}

export interface IFile {
  language: string;
  filename: string;
  name: string;
  type: any;
  size: number;
  content?: string;
  raw_url?: string;
}

export interface IAnchor {
  href?: string;
  onClick?: () => void;
  children?: React.ReactChild;
  download?: string;
  color?: string;
  className?: string;
}

interface IGaEvent {
  category: string;
  action: string;
  label: string;
  value: string;
}

interface ISettings {
  get: () => void;
  set: () => void;
  getAll: () => void;
}

interface IState {
  snippets: {
    snippets: ISnippet[];
    starred: string[];
  };
}

interface IClipboardEvent {
  clipboardData: any;
  preventDefault: any;
}
