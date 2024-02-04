import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from "../App";

describe('render app', () => {
  const renderApp = () => render(<App />)

  it('should render app images', () => {
    renderApp();

    const countButton = screen.getByRole('button', {name: 'count is 0'});

    expect(countButton).toBeVisible();

  });

});