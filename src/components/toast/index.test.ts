import { toast, EVENT_NAME } from '.';

describe('toast', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('show', () => {
    it('dispatches a custom event with all parameters', () => {
      const mockDispatchEvent = vi.fn();
      vi.stubGlobal('dispatchEvent', mockDispatchEvent);

      toast.show({
        message: 'Test message',
        title: 'Test title',
        type: 'success',
        duration: 5000,
        id: 'test-id',
      });

      expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
      const event = mockDispatchEvent.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe(EVENT_NAME);
      expect(event.detail).toEqual({
        message: 'Test message',
        title: 'Test title',
        type: 'success',
        duration: 5000,
        id: 'test-id',
      });
    });

    it('uses default values when optional params are missing', () => {
      const mockDispatchEvent = vi.fn();
      vi.stubGlobal('dispatchEvent', mockDispatchEvent);

      toast.show({ message: 'Test message' });

      expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
      const event = mockDispatchEvent.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual({
        message: 'Test message',
        type: 'info',
        duration: 3000,
      });
    });
  });

  describe('info', () => {
    it('dispatches event with type info', () => {
      const mockDispatchEvent = vi.fn();
      vi.stubGlobal('dispatchEvent', mockDispatchEvent);

      toast.info({ message: 'Info message' });

      expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
      const event = mockDispatchEvent.mock.calls[0][0] as CustomEvent;
      expect(event.detail.type).toBe('info');
    });
  });

  describe('warn', () => {
    it('dispatches event with type warn', () => {
      const mockDispatchEvent = vi.fn();
      vi.stubGlobal('dispatchEvent', mockDispatchEvent);

      toast.warn({ message: 'Warn message' });

      expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
      const event = mockDispatchEvent.mock.calls[0][0] as CustomEvent;
      expect(event.detail.type).toBe('warn');
    });
  });

  describe('error', () => {
    it('dispatches event with type error', () => {
      const mockDispatchEvent = vi.fn();
      vi.stubGlobal('dispatchEvent', mockDispatchEvent);

      toast.error({ message: 'Error message' });

      expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
      const event = mockDispatchEvent.mock.calls[0][0] as CustomEvent;
      expect(event.detail.type).toBe('error');
    });
  });
});
