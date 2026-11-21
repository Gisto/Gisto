import hljs from 'highlight.js';
import markdownIt from 'markdown-it';

import { upperCaseFirst } from '@/utils';

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const highlight = (str: string, lang?: string): string => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return `<pre><div class="relative text-xs border-b bottom-1 pb-3 mb-4">${upperCaseFirst(lang)}</div><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
    } catch (err) {
      console.error('Error highlighting code:', err);
      void err;
    }
  }
  try {
    return `<pre><code class="hljs">${hljs.highlightAuto(str).value}</code></pre>`;
  } catch (err) {
    void err;
    return `<pre><code class="hljs">${escapeHtml(str)}</code></pre>`;
  }
};

/**
 * Single source of truth for markdown rendering. Every surface that renders
 * markdown (snippet preview, kind views) builds on this configuration so link
 * and code output stays identical.
 */
export const createMarkdown = (): markdownIt => {
  const md = markdownIt({ html: true, linkify: true, typographer: true, highlight });

  const defaultLinkRender =
    md.renderer.rules.link_open ||
    ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options));

  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    tokens[index].attrSet('target', '_blank');
    tokens[index].attrSet('rel', 'noreferrer noopener');

    return defaultLinkRender(tokens, index, options, env, self);
  };

  return md;
};

export const markdown = createMarkdown();
