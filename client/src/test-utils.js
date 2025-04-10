import { render } from '@testing-library/react';
import React from 'react';

export const mockUseAuth = jest.fn();

const defaultAuthState = {
  isAuthenticated: false,
  user: null,
  userName: null,
  loading: false,
  login: jest.fn(),
  logout: jest.fn()
};

jest.mock('./context/AuthContext.jsx', () => ({
  useAuth: () => mockUseAuth()
}));

export const resetAuthMocks = () => {
  mockUseAuth.mockReset().mockReturnValue(defaultAuthState);
};

const MockAuthProvider = ({ children }) => {
  mockUseAuth.mockReturnValue(defaultAuthState);
  return children;
};

/**
 * Renders a component with auth context
 * @param {ReactElement} ui - Component to render
 * @param {object} options - Optional auth state overrides
 * @returns {RenderResult} Testing Library render result
 */
export const renderWithAuth = (ui, { authState = {}, ...options } = {}) => {
  resetAuthMocks();
  mockUseAuth.mockReturnValue({ ...defaultAuthState, ...authState });
  
  return render(ui, options);
};

afterEach(() => {
  mockUseAuth.mockClear();
});

export * from '@testing-library/react';