import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';

export function renderWithProviders(ui: React.ReactNode) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}
