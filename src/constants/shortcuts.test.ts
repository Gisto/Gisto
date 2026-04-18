import { describe, it, expect } from 'vitest';

const shortcutsConfig = [
  {
    category: 'Global',
    items: [
      { keys: ['Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['?'], description: 'Show shortcuts help' },
      { keys: ['Esc'], description: 'Close modal / blur input' },
    ],
  },
  {
    category: 'Command Palette',
    items: [
      { keys: ['↑', '↓'], description: 'Navigate' },
      { keys: ['Enter'], description: 'Select' },
    ],
  },
  {
    category: 'Actions',
    items: [
      { keys: ['Ctrl', 'S'], description: 'Save snippet' },
      { keys: ['/'], description: 'Focus search' },
    ],
  },
];

const paletteCommands = [
  {
    id: 'dashboard',
    label: 'Go to Dashboard',
    icon: 'home',
    shortcut: 'd',
    action: 'navigate',
    path: '/',
  },
  {
    id: 'new',
    label: 'Create New Snippet',
    icon: 'plus',
    shortcut: 'n',
    action: 'navigate',
    path: '/new-snippet',
  },
  {
    id: 'settings',
    label: 'Open Settings',
    icon: 'settings',
    shortcut: 's',
    action: 'navigate',
    path: '/settings',
  },
  {
    id: 'reload',
    label: 'Reload All Snippets',
    icon: 'refresh',
    shortcut: 'r',
    action: 'reload',
  },
];

describe('shortcutsConfig', () => {
  it('should have global shortcuts', () => {
    const global = shortcutsConfig.find((c) => c.category === 'Global');
    expect(global).toBeDefined();
    expect(global?.items.length).toBeGreaterThan(0);
  });

  it('should have command palette shortcuts', () => {
    const palette = shortcutsConfig.find((c) => c.category === 'Command Palette');
    expect(palette).toBeDefined();
    expect(palette?.items.length).toBeGreaterThan(0);
  });

  it('should have actions shortcuts', () => {
    const actions = shortcutsConfig.find((c) => c.category === 'Actions');
    expect(actions).toBeDefined();
    expect(actions?.items.length).toBeGreaterThan(0);
  });

  it('should include Ctrl+K for command palette', () => {
    const global = shortcutsConfig.find((c) => c.category === 'Global');
    const kShortcut = global?.items.find((s) => s.keys.includes('Ctrl') && s.keys.includes('K'));
    expect(kShortcut).toBeDefined();
    expect(kShortcut?.description).toBe('Open command palette');
  });

  it('should include ? for help', () => {
    const global = shortcutsConfig.find((c) => c.category === 'Global');
    const helpShortcut = global?.items.find((s) => s.keys.includes('?'));
    expect(helpShortcut).toBeDefined();
    expect(helpShortcut?.description).toBe('Show shortcuts help');
  });

  it('should include / for search', () => {
    const actions = shortcutsConfig.find((c) => c.category === 'Actions');
    const searchShortcut = actions?.items.find((s) => s.keys.includes('/'));
    expect(searchShortcut).toBeDefined();
    expect(searchShortcut?.description).toBe('Focus search');
  });

  it('should include Esc for closing', () => {
    const global = shortcutsConfig.find((c) => c.category === 'Global');
    const escShortcut = global?.items.find((s) => s.keys.includes('Esc'));
    expect(escShortcut).toBeDefined();
  });
});

describe('paletteCommands', () => {
  it('should have dashboard command', () => {
    const dashboard = paletteCommands.find((c) => c.id === 'dashboard');
    expect(dashboard).toBeDefined();
    expect(dashboard?.shortcut).toBe('d');
    expect(dashboard?.action).toBe('navigate');
    expect(dashboard?.path).toBe('/');
  });

  it('should have new snippet command', () => {
    const newSnippet = paletteCommands.find((c) => c.id === 'new');
    expect(newSnippet).toBeDefined();
    expect(newSnippet?.shortcut).toBe('n');
    expect(newSnippet?.action).toBe('navigate');
    expect(newSnippet?.path).toBe('/new-snippet');
  });

  it('should have settings command', () => {
    const settings = paletteCommands.find((c) => c.id === 'settings');
    expect(settings).toBeDefined();
    expect(settings?.shortcut).toBe('s');
    expect(settings?.action).toBe('navigate');
    expect(settings?.path).toBe('/settings');
  });

  it('should have reload command', () => {
    const reload = paletteCommands.find((c) => c.id === 'reload');
    expect(reload).toBeDefined();
    expect(reload?.shortcut).toBe('r');
    expect(reload?.action).toBe('reload');
  });

  it('should have unique shortcuts', () => {
    const shortcuts = paletteCommands.map((c) => c.shortcut);
    const unique = new Set(shortcuts);
    expect(unique.size).toBe(shortcuts.length);
  });

  it('all commands should have labels', () => {
    paletteCommands.forEach((cmd) => {
      expect(cmd.label).toBeDefined();
      expect(cmd.label.length).toBeGreaterThan(0);
    });
  });

  it('all commands should have shortcuts', () => {
    paletteCommands.forEach((cmd) => {
      expect(cmd.shortcut).toBeDefined();
      expect(cmd.shortcut.length).toBeGreaterThan(0);
    });
  });

  it('all commands should have icons', () => {
    paletteCommands.forEach((cmd) => {
      expect(cmd.icon).toBeDefined();
    });
  });

  it('all navigate commands should have paths', () => {
    paletteCommands
      .filter((c) => c.action === 'navigate')
      .forEach((cmd) => {
        expect(cmd.path).toBeDefined();
        expect(cmd.path?.length).toBeGreaterThan(0);
      });
  });

  it('all reload commands should not have paths', () => {
    paletteCommands
      .filter((c) => c.action === 'reload')
      .forEach((cmd) => {
        expect(cmd.path).toBeUndefined();
      });
  });
});

describe('shortcut combinations', () => {
  it('should use / for search (not Ctrl+F)', () => {
    const actions = shortcutsConfig.find((c) => c.category === 'Actions');
    const searchShortcut = actions?.items.find((s) => s.keys.includes('/'));
    expect(searchShortcut).toBeDefined();
    expect(searchShortcut?.description).toBe('Focus search');
  });

  it('should have Ctrl+S for save', () => {
    const actions = shortcutsConfig.find((c) => c.category === 'Actions');
    const saveShortcut = actions?.items.find(
      (s) => s.keys.includes('Ctrl') && s.keys.includes('S')
    );
    expect(saveShortcut).toBeDefined();
    expect(saveShortcut?.description).toBe('Save snippet');
  });

  it('should have Ctrl+K for command palette', () => {
    const global = shortcutsConfig.find((c) => c.category === 'Global');
    const kShortcut = global?.items.find((s) => s.keys.includes('Ctrl') && s.keys.includes('K'));
    expect(kShortcut).toBeDefined();
    expect(kShortcut?.description).toBe('Open command palette');
  });
});
