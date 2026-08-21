import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DefaultModal } from '../../../../components/ui/default-modal/default-modal';
import { renderWithProviders } from '../../../test-utils';
import userEvent from '@testing-library/user-event';

describe('DefaultModal', () => {
  it('should render the title and the question', () => {
    renderWithProviders(
      <DefaultModal
        isOpen={true}
        title="Delete investment"
        question="Are you sure?"
        onAccept={vi.fn()}
        onCancel={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Delete investment')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should call onAccept when the Accept button is clicked', async () => {
    const user = userEvent.setup();

    const onAccept = vi.fn();

    renderWithProviders(
      <DefaultModal
        isOpen={true}
        title="Delete investment"
        question="Are you sure?"
        onAccept={onAccept}
        onCancel={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Accept' }));

    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('should close when the onCancel button is clicked', async () => {
    const user = userEvent.setup();

    const onCancel = vi.fn();

    renderWithProviders(
      <DefaultModal
        isOpen={true}
        title="Delete investment"
        question="Are you sure?"
        onAccept={vi.fn()}
        onCancel={onCancel}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
