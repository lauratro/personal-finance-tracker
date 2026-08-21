import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DefaultModal } from '../../../../components/ui/default-modal/default-modal';
import { renderWithProviders } from '../../../test-utils';

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
});
