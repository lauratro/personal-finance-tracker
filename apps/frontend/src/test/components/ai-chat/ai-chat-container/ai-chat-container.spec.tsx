import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import { AiChatBoxContainer } from '@/components/ai-chat';

const aiChatApi = vi.hoisted(() => ({
  sendMessageToAIChat: vi.fn(),
}));

vi.mock('@/components-apis/ai-chat/ai-chat-api', () => aiChatApi);

describe('AiChatBoxContainer', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should show the assistant button and no dialog initially', () => {
    renderWithProviders(<AiChatBoxContainer />);

    expect(
      screen.getByRole('button', { name: 'Open AI Assistant' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('dialog', { name: 'Ai Assistant Dialog' }),
    ).not.toBeInTheDocument();
  });

  it('should open the dialog when the assistant button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AiChatBoxContainer />);

    await user.click(screen.getByRole('button', { name: 'Open AI Assistant' }));

    expect(
      await screen.findByRole('dialog', { name: 'Ai Assistant Dialog' }),
    ).toBeInTheDocument();
  });

  it('should close the dialog when the assistant button is clicked again', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AiChatBoxContainer />);

    const button = screen.getByRole('button', { name: 'Open AI Assistant' });

    await user.click(button);
    await screen.findByRole('dialog', { name: 'Ai Assistant Dialog' });

    await user.click(button);

    expect(
      screen.queryByRole('dialog', { name: 'Ai Assistant Dialog' }),
    ).not.toBeInTheDocument();
  });
});
