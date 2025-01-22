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
  starred: boolean;
  comments: {
    edges: Array<{
      node: {
        id: string;
        author: {
          login: string;
          avatarUrl: string;
        };
        bodyHTML: string;
        createdAt: string;
      };
    }>;
  };
};

export type GistEnrichedType = GistType & {
  title: string;
  tags: string[];
  isUntitled: boolean;
  languages: { name: string; color: string }[];
};
