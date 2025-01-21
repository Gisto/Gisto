export type GistFileType = {
  filename: string;
  content: string;
  language: string;
  encoding: string;
  raw_url: string;
  size: number;
  truncated: boolean;
  type: string;
};

export type GistType = {
  resourcePath: string;
  html_url: string;
  files: Record<string, GistFileType>;
  id: string;
  isPublic: boolean;
  createdAt: string;
  description: string;
  stars: number;
};

export type GistEnrichedType = GistType & {
  title: string;
  tags: string[];
  isUntitled: boolean;
  languages: { name: string; color: string }[];
};
