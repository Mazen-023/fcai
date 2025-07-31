import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('renders hello form', () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: 'Hello, World!', status: 'success' }),
  });

  render(<App />);
  const inputElement = screen.getByPlaceholderText(/enter your name/i);
  const buttonElement = screen.getByRole('button', { name: /say hello/i });
  
  expect(inputElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});

test('submits form and displays message', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: 'Hello, Test!', status: 'success' }),
  });

  render(<App />);
  
  const inputElement = screen.getByPlaceholderText(/enter your name/i);
  const buttonElement = screen.getByRole('button', { name: /say hello/i });
  
  fireEvent.change(inputElement, { target: { value: 'Test' } });
  fireEvent.click(buttonElement);
  
  await waitFor(() => {
    expect(screen.getByText('Hello, Test!')).toBeInTheDocument();
  });
});
