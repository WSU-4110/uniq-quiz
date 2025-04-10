import { renderWithAuth, screen } from '../test-utils';
import ProfileBanner from '../components/ProfileBanner';

/**
 * Assignment 5 Unit Tests
 * Author: Hayley Spellicy-Ryan
 * Methods tested: 
 *      1. ProfileBanner()
 */

describe('ProfileBanner', () => {
  test('renders username when logged in', () => {
    // Import render wrapper to pass auth information to ProfileBanner
    renderWithAuth(<ProfileBanner />, {
      authState: {
        isAuthenticated: true,
        user: '123',
        userName: 'Test User',
        loading: false
      }
    });
    
    // Check if username displays on screen
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('renders "Welcome" when logged out', () => {
    // Import default render wrapper with logged out information
    renderWithAuth(<ProfileBanner />);

    // Check if default message displays on screen
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});