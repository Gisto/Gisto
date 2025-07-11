import { render } from '@testing-library/react';
import { z } from 'zod';

import { ZodError } from './zod-error';

describe('ZodError Component', () => {
  it('renders the error message when an error exists for the given path', () => {
    const errors: z.core.$ZodIssue[] = [
      { path: ['field1'], message: 'Field1 is required', code: 'custom', input: undefined },
    ];
    const path = 'field1';

    const { getByText } = render(<ZodError errors={errors} path={path} />);

    expect(getByText('Field1 is required')).toBeInTheDocument();
  });

  it('renders nothing when no error exists for the given path', () => {
    const errors: z.core.$ZodIssue[] = [
      { path: ['field1'], message: 'Field1 is required', code: 'custom', input: undefined },
    ];
    const path = 'field2';

    const { container } = render(<ZodError errors={errors} path={path} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders with correct styles and animation', () => {
    const errors: z.core.$ZodIssue[] = [
      { path: ['field1'], message: 'Field1 is required', code: 'custom', input: undefined },
    ];
    const path = 'field1';

    const { getByText } = render(<ZodError errors={errors} path={path} />);
    const errorElement = getByText('Field1 is required');

    expect(errorElement).toHaveClass('text-danger text-xs flex items-center gap-2');
  });

  it('matches the snapshot', () => {
    const errors: z.core.$ZodIssue[] = [
      { path: ['field1'], message: 'Field1 is required', code: 'custom', input: undefined },
    ];
    const path = 'field1';

    const { asFragment } = render(<ZodError errors={errors} path={path} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
