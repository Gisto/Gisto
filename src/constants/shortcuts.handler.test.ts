import { describe, it, expect, vi, beforeEach } from 'vitest';

const createMockHandler = () => {
  const setShowShortcutsModal = vi.fn();
  const setShowCommandPalette = vi.fn();

  const handler = (e: KeyboardEvent) => {
    const isMod = e.ctrlKey || e.metaKey;

    if (isMod && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setShowCommandPalette(true);
      return;
    }

    if (isMod && e.key === '/') {
      e.preventDefault();
      setShowShortcutsModal(true);
      return;
    }

    if (e.key === '?' && !isMod) {
      const el = e.target as HTMLElement;
      const isEditable =
        el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.isContentEditable;
      if (!isEditable) {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
      return;
    }

    if (!isMod && e.key === '/') {
      e.preventDefault();
      return;
    }
  };

  return { handler, setShowShortcutsModal, setShowCommandPalette };
};

describe('? key handler (editable element guard)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('opens shortcuts modal when ? pressed outside editable element', () => {
    const { handler, setShowShortcutsModal } = createMockHandler();
    const event = new KeyboardEvent('keydown', { key: '?' });
    vi.spyOn(event, 'preventDefault');

    handler(event);

    expect(setShowShortcutsModal).toHaveBeenCalledWith(true);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('does not open shortcuts modal when ? pressed in INPUT', () => {
    const { handler, setShowShortcutsModal } = createMockHandler();
    const input = document.createElement('input');
    const event = new KeyboardEvent('keydown', { key: '?', bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi.spyOn(event, 'preventDefault');

    handler(event);

    expect(setShowShortcutsModal).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('does not open shortcuts modal when ? pressed in TEXTAREA', () => {
    const { handler, setShowShortcutsModal } = createMockHandler();
    const textarea = document.createElement('textarea');
    const event = new KeyboardEvent('keydown', { key: '?' });
    Object.defineProperty(event, 'target', { value: textarea });
    vi.spyOn(event, 'preventDefault');

    handler(event);

    expect(setShowShortcutsModal).not.toHaveBeenCalled();
  });

  it('does not open shortcuts modal when ? pressed in contentEditable', () => {
    const { handler, setShowShortcutsModal } = createMockHandler();
    const div = document.createElement('div');
    Object.defineProperty(div, 'isContentEditable', { value: true });
    const event = new KeyboardEvent('keydown', { key: '?' });
    Object.defineProperty(event, 'target', { value: div });
    vi.spyOn(event, 'preventDefault');

    handler(event);

    expect(setShowShortcutsModal).not.toHaveBeenCalled();
  });

  it('opens shortcuts modal for Ctrl+/ even in editable elements', () => {
    const { handler, setShowShortcutsModal } = createMockHandler();
    const textarea = document.createElement('textarea');
    const event = new KeyboardEvent('keydown', { key: '/', ctrlKey: true });
    Object.defineProperty(event, 'target', { value: textarea });
    vi.spyOn(event, 'preventDefault');

    handler(event);

    expect(setShowShortcutsModal).toHaveBeenCalledWith(true);
  });

  it('opens shortcuts modal for Cmd+/ even in editable elements', () => {
    const { handler, setShowShortcutsModal } = createMockHandler();
    const input = document.createElement('input');
    const event = new KeyboardEvent('keydown', { key: '/', metaKey: true });
    Object.defineProperty(event, 'target', { value: input });

    handler(event);

    expect(setShowShortcutsModal).toHaveBeenCalledWith(true);
  });
});
