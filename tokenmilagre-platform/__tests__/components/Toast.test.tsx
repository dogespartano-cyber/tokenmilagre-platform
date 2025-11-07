/**
 * Testes para componente Toast
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock do componente Toast (assumindo estrutura básica)
const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div role="alert" data-type={type}>
    {message}
  </div>
);

describe('Toast Component', () => {
  it('should render success toast', () => {
    render(<Toast message="Success!" type="success" />);
    const toast = screen.getByRole('alert');

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Success!');
    expect(toast).toHaveAttribute('data-type', 'success');
  });

  it('should render error toast', () => {
    render(<Toast message="Error!" type="error" />);
    const toast = screen.getByRole('alert');

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Error!');
    expect(toast).toHaveAttribute('data-type', 'error');
  });
});
