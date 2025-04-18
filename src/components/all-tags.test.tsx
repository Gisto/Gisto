import { render, screen, fireEvent } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { AllTags } from './all-tags';

import { useStoreValue } from '@/lib/store/globalState';
import { fetchAndUpdateSnippets } from '@/lib/utils';

vi.mock('@/lib/store/globalState', () => ({
  useStoreValue: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  fetchAndUpdateSnippets: vi.fn(),
  cn: vi.fn(),
  upperCaseFirst: vi.fn(),
}));

describe('AllTags', () => {
  it('renders all unique tags with their counts', () => {
    (useStoreValue as Mock).mockReturnValue([
      { tags: ['#tag1', '#tag2'] },
      { tags: ['#tag1', '#tag3'] },
    ]);

    render(<AllTags />);

    const tag1 = screen.getByTestId('tag-tag1');
    expect(tag1?.textContent?.trim() === '#tag1 (2)').toBeTruthy();

    const tag2 = screen.getByTestId('tag-tag2');
    expect(tag2?.textContent?.trim() === '#tag2 (1)').toBeTruthy();

    const tag3 = screen.getByTestId('tag-tag3');
    expect(tag3?.textContent?.trim() === '#tag3 (1)').toBeTruthy();
  });

  it('filters tags based on search input', () => {
    (useStoreValue as Mock).mockReturnValue([{ tags: ['#tag1', '#tag2', '#tag3'] }]);

    render(<AllTags />);

    const input = screen.getByPlaceholderText('Filter 3 tags');
    fireEvent.change(input, { target: { value: 'tag2' } });

    const tag2 = screen.getByTestId('tag-tag2');
    expect(tag2?.textContent?.trim() === '#tag2 (1)').toBeTruthy();
  });

  it('renders message when no tags match the search', () => {
    (useStoreValue as Mock).mockReturnValue([{ tags: ['#tag1', '#tag2'] }]);

    render(<AllTags allowCreate={false} />);

    const input = screen.getByPlaceholderText('Filter 2 tags');
    fireEvent.change(input, { target: { value: 'tag3' } });
    expect(screen.getByText('No tags matching tag3')).toBeInTheDocument();
  });

  it('creates a new tag when allowCreate is true and no match is found', () => {
    (useStoreValue as Mock).mockReturnValue([{ tags: ['#tag1'] }]);
    const onClickMock = vi.fn();

    render(<AllTags allowCreate={true} onClick={onClickMock} />);

    const input = screen.getByPlaceholderText('Filter 1 tags');
    fireEvent.change(input, { target: { value: 'tag2' } });
    const createButton = screen.getByText('Create "#tag2" tag');
    fireEvent.click(createButton);
    expect(onClickMock).toHaveBeenCalledWith('#tag2');
  });

  it('fetches snippets when the list is empty', () => {
    (useStoreValue as Mock).mockReturnValue([]);

    render(<AllTags />);

    expect(fetchAndUpdateSnippets).toHaveBeenCalled();
  });

  it('calls onClick with the correct tag when a tag is clicked', () => {
    (useStoreValue as Mock).mockReturnValue([{ tags: ['#tag1'] }]);
    const onClickMock = vi.fn();

    render(<AllTags onClick={onClickMock} />);

    const tag = screen.getByTestId('tag-tag1');
    fireEvent.click(tag);
    expect(onClickMock).toHaveBeenCalledWith('#tag1');
  });
});
