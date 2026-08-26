import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import { DeleteButton } from '../../../../components/ui/delete-button/delete-button';

describe('DeleteButton', () => {
  it('should open the modal when the trash icon is clicked', async () => {
    const user = userEvent.setup();

    const onAccept = vi.fn();
    renderWithProviders(
      <DeleteButton
        onAccept={onAccept}
        title="Delete investment"
        question="Are you sure?"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Delete investment' }));

    expect(await screen.findByText('Are you sure?')).toBeInTheDocument();
  });
});
