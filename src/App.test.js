import { render, screen } from '@testing-library/react';
import App from './App';

import '@testing-library/jest-dom';

test('renders search input', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Search for media/i);
  expect(input).toBeInTheDocument();
});

