import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App.tsx';
import * as MetricsClient from '../metrics/client/MetricsClient';

describe('render app', () => {
  it('should render and increment count', async () => {
    // Mock the metrics service
    vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
      saveMetricEvent: vi.fn().mockResolvedValue(undefined),
    });

    const user = userEvent.setup();
    render(<App />);

    const countButton = screen.getByRole('button', { name: 'count is 0' });
    expect(countButton).toBeVisible();

    await user.click(countButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'count is 1' })).toBeVisible();
    });
  });
});
