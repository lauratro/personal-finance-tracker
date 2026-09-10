import { AiChatBox } from '@/components/ai-chat/parts/ai-chat-box';
import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import { sendMessageToAIChat } from '@/components-apis/ai-chat';

describe('AiChatBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  vi.mock('@/components-apis/ai-chat/ai-chat-api', () => ({
    sendMessageToAIChat: vi.fn(),
  }));

  it('should show the chat dialog when opened is true', () => {
    const setOpened = vi.fn();

    renderWithProviders(<AiChatBox opened={true} setOpened={setOpened} />);

    expect(
      screen.getByRole('dialog', { name: 'Ai Assistant Dialog' }),
    ).toBeInTheDocument();
  });

  it('should allow a user to write a message', async () => {
    const user = userEvent.setup();
    const isOpened = vi.fn();
    renderWithProviders(<AiChatBox opened={true} setOpened={isOpened} />);

    const input = screen.getByRole('textbox', {
      name: 'Ask your financial assistant',
    });

    await user.type(input, 'How are my investments?');

    expect(input).toHaveValue('How are my investments?');
  });

  it('should the Send button be disabled when the input text is empty', async () => {
    const isOpened = vi.fn();

    renderWithProviders(<AiChatBox opened={true} setOpened={isOpened} />);

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('should the Send button be enabled when the user type a message', async () => {
    const user = userEvent.setup();
    const setOpened = vi.fn();

    renderWithProviders(<AiChatBox opened={true} setOpened={setOpened} />);

    const input = screen.getByRole('textbox', {
      name: 'Ask your financial assistant',
    });

    await user.type(input, 'How are my investments?');

    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  it('should send a message to the AiChat', async () => {
    const user = userEvent.setup();
    const isOpened = vi.fn();

    vi.mocked(sendMessageToAIChat).mockResolvedValue({
      response: 'Your investments are performing well.',
    });

    renderWithProviders(<AiChatBox opened={true} setOpened={isOpened} />);

    const input = screen.getByRole('textbox', {
      name: 'Ask your financial assistant',
    });

    await user.type(input, 'How are my investments?');

    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(sendMessageToAIChat).toHaveBeenCalledWith('How are my investments?');

    expect(
      await screen.findByText('Your investments are performing well.'),
    ).toBeInTheDocument();
  });
});
