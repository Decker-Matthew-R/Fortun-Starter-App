import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';
import { config } from 'react-transition-group';

// Removes MUI animations for testing
config.disabled = true;

expect.extend(matchers);

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
