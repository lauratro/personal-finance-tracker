import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import { AiChatIcon } from '@/components/ai-chat/parts/ai-chat-icon';

it('Should open the modal when the icon is clicked', async () => {
  const userClick = userEvent.setup();

  const setIsVisible = vi.fn();

  renderWithProviders(
    <AiChatIcon isVisible={false} setIsVisible={setIsVisible} />,
  );

  const click = await userClick.click(screen.getByRole('button'));
  expect(setIsVisible).toHaveBeenCalledWith(true);
});
