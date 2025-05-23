import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header with logo', () => {
  render(<App />);
  const logoElement = screen.getByAltText(/logo/i);
  expect(logoElement).toBeInTheDocument();
});

test('renders banner', () => {
  render(<App />);
  const bannerElement = screen.getByText(/banner text/i); // Replace with actual banner text
  expect(bannerElement).toBeInTheDocument();
});

test('renders latest posts section', () => {
  render(<App />);
  const latestPostsElement = screen.getByText(/latest posts/i); // Replace with actual section title
  expect(latestPostsElement).toBeInTheDocument();
});

test('renders featured posts section', () => {
  render(<App />);
  const featuredPostsElement = screen.getByText(/featured posts/i); // Replace with actual section title
  expect(featuredPostsElement).toBeInTheDocument();
});

test('renders footer with social links', () => {
  render(<App />);
  const footerElement = screen.getByText(/social links/i); // Replace with actual footer text
  expect(footerElement).toBeInTheDocument();
});