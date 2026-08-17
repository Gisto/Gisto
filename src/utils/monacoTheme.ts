import type { Monaco } from '@monaco-editor/react';

interface MonacoThemeRule {
  token: string;
  foreground?: string;
}

interface MonacoThemeData {
  base: 'vs' | 'vs-dark';
  inherit: boolean;
  rules: MonacoThemeRule[];
  colors: Record<string, string>;
}

function toHexColor(color: string): string {
  if (!color) return '#000000';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '#000000';
    ctx.fillStyle = '#000000';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  } catch {
    return '#000000';
  }
}

function sampleColor(expression: string, dark: boolean): string {
  const probe = document.createElement('div');
  probe.style.position = 'fixed';
  probe.style.visibility = 'hidden';
  probe.style.background = expression;

  const html = document.documentElement;
  const wasDark = html.classList.contains('dark');

  if (dark) {
    probe.classList.add('dark');
  } else if (wasDark) {
    html.classList.remove('dark');
  }

  document.body.appendChild(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();

  if (wasDark) {
    html.classList.add('dark');
  }

  return toHexColor(color);
}

function buildThemeData(dark: boolean): MonacoThemeData {
  const background = sampleColor('var(--background)', dark);
  const foreground = sampleColor('var(--foreground)', dark);
  const mutedForeground = sampleColor('var(--muted-foreground)', dark);
  const accent = sampleColor('var(--accent)', dark);
  const border = sampleColor('var(--border)', dark);
  const card = sampleColor('var(--card)', dark);
  const popover = sampleColor('var(--popover)', dark);
  const primary = sampleColor('hsl(var(--primary))', dark);

  return {
    base: dark ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': background,
      'editor.foreground': foreground,
      'editorLineNumber.foreground': mutedForeground,
      'editorLineNumber.activeForeground': foreground,
      'editorLineNumber.dimmedForeground': mutedForeground,
      'editorGutter.background': background,
      'editor.selectionBackground': accent,
      'editor.inactiveSelectionBackground': accent,
      'editor.lineHighlightBackground': accent,
      'editor.lineHighlightBorder': '#00000000',
      'editorCursor.foreground': primary,
      'editorCursor.background': foreground,
      'editorWhitespace.foreground': border,
      'editorIndentGuide.background1': border,
      'editorIndentGuide.activeBackground1': primary,
      'editorWidget.background': card,
      'editorWidget.border': border,
      'editorHoverWidget.background': popover,
      'editorHoverWidget.border': border,
      'editorSuggestWidget.background': popover,
      'editorSuggestWidget.selectedBackground': accent,
      'editorSuggestWidget.border': border,
      'diffEditor.diagonalFill': border,
    },
  };
}

export function defineEditorThemes(monaco: Monaco): void {
  monaco.editor.defineTheme('gisto-light', buildThemeData(false));
  monaco.editor.defineTheme('gisto-dark', buildThemeData(true));
}
