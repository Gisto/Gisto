import { render } from '@testing-library/react';

import { Loading } from './loading';

describe('Loading', () => {
  it('matches the snapshot', () => {
    const { container } = render(<Loading />);
    expect(container).toMatchSnapshot();
  });

  it('renders with message', () => {
    const { getByText } = render(<Loading message="Loading data..." />);
    expect(getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    const { container } = render(<Loading size={4} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('size-4');
  });

  it('renders with custom className', () => {
    const { container } = render(<Loading className="custom-class" />);
    const div = container.firstChild;
    expect(div).toHaveClass('custom-class');
  });
});
