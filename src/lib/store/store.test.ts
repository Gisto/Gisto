import { vi } from 'vitest';

import { Store } from './store';

describe('Store', () => {
  it('should initialize with provided state', () => {
    const initialState = { count: 0 };
    const store = new Store(initialState);

    expect(store.getState()).toEqual(initialState);
  });

  it('should update state with setState', () => {
    const initialState = { count: 0 };
    const store = new Store(initialState);

    store.setState({ count: 1 });

    expect(store.getState()).toEqual({ count: 1 });
  });

  it('should merge partial updates', () => {
    const initialState = { count: 0, name: 'test' };
    const store = new Store(initialState);

    store.setState({ count: 1 });

    expect(store.getState()).toEqual({ count: 1, name: 'test' });
  });

  it('should notify listeners on state change', () => {
    const initialState = { count: 0 };
    const store = new Store(initialState);
    const listener = vi.fn();

    store.subscribe(listener);

    store.setState({ count: 1 });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ count: 1 });
  });

  it('should not notify unsubscribed listeners', () => {
    const initialState = { count: 0 };
    const store = new Store(initialState);
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    unsubscribe();

    store.setState({ count: 1 });

    expect(listener).not.toHaveBeenCalled();
  });

  it('should handle multiple listeners', () => {
    const initialState = { count: 0 };
    const store = new Store(initialState);
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    store.subscribe(listener1);
    store.subscribe(listener2);

    store.setState({ count: 1 });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });
});
