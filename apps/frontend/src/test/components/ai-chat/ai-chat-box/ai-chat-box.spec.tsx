import { AiChatBox } from '@/components/ai-chat/parts/ai-chat-box';
import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import userEvent from '@testing-library/user-event';

it('should show the chat dialog when opened is true', () => {
  const setOpened = vi.fn();

  renderWithProviders(<AiChatBox opened={true} setOpened={setOpened} />);

  expect(
    screen.getByRole('dialog', { name: 'Ai Assistant Dialog' }),
  ).toBeInTheDocument();
});
