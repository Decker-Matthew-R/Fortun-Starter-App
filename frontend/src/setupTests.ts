import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { config } from 'react-transition-group';

// Removes MUI animations for testing
config.disabled = true;

export const server = setupServer();
beforeAll(() => {
    server.listen();
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});
