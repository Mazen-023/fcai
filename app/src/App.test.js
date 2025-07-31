import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Home page', () => {
  render(<App />);
  // Check for the main heading in Home.jsx
  expect(screen.getByText(/welcome to fcai-learn/i)).toBeInTheDocument();
});
