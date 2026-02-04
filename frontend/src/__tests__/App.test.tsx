import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.tsx';

describe('render app', () => {
    it('should render and increment count', async () => {
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
