import { render } from '@testing-library/react';
import { Loading } from './loading';

describe('Loading', () => {
  it('matches the snapshot', () => {
    const { container } = render(<Loading />);
    expect(container).toMatchSnapshot();
  });
});
