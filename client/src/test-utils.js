import { render } from '@testing-library/react';
import { useParams } from 'react-router-dom';

export const mockUseAuth = jest.fn();
export const mockLogin = jest.fn();

const defaultAuthState = {
  isAuthenticated: false,
  user: null,
  userName: null,
  loading: false,
  login: jest.fn(),
  logout: jest.fn()
};

const loggedInState = {
  success: true
}
const loggedOutState = {
  error: "Something went wrong."
}

jest.mock('./context/AuthContext.jsx', () => ({
  useAuth: () => mockUseAuth(),
  login: () => mockLogin()
}));

export const resetAuthMocks = () => {
  mockUseAuth.mockReset().mockReturnValue(defaultAuthState);
  mockLogin.mockReset().mockReturnValue(loggedOutState);
};

const MockAuthProvider = ({ children }) => {
  mockUseAuth.mockReturnValue(defaultAuthState);
  mockLogin.mockReturnValue(loggedOutState);
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
  mockLogin.mockClear();
});

export * from '@testing-library/react';