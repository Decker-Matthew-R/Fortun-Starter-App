import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('render app', () => {
    const renderApp = () => render(<App />);

    it('should render app images', async () => {
        renderApp();

        const countButton = screen.getByRole('button', { name: 'count is 0' });

        expect(countButton).toBeVisible();

        await waitFor(() => {
            countButton.click();
            expect('count is 1').toBeVisible();
        });
    });
});
