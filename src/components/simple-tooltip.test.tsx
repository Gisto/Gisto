import { render } from '@testing-library/react';

import { SimpleTooltip } from './simple-tooltip';

import { TooltipProvider } from '@/components/ui/tooltip';

describe('SimpleTooltip Component', () => {
  it('renders correctly with default trigger', () => {
    const { asFragment } = render(
      <TooltipProvider>
        <SimpleTooltip content="Tooltip content" />
      </TooltipProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with custom trigger', () => {
    const { asFragment } = render(
      <TooltipProvider>
        <SimpleTooltip content="Tooltip content">
          <a>Custom Trigger</a>
        </SimpleTooltip>
      </TooltipProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('applies custom className to TooltipContent', () => {
    const { asFragment } = render(
      <TooltipProvider>
        <SimpleTooltip content="Tooltip content" className="custom-class" />
      </TooltipProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
