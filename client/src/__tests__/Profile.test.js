import { renderWithAuth, screen } from '../test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from '../pages/Profile/Profile';
import axios from 'axios';

/**
 * Assignment 5 Unit Tests
 * Author: Trevor Harris
 * Methods tested: 
 *      1. getUser() - for Stats and Insets
 *      2. getUser() - for checking other Profiles
 *      3. Checking for Errors
 */

describe('Profile', () => {
    const mockUserData = {
        User_id: '123',
        Username: 'Test User',
        Profile_Pic: 'test.jpg',
        Wins: 5,
        Total_Score: 100,
        Highest_Score_id: 1,
        Highest_Score: 50,
        Private: false
    };

    const mockDeckData = [
        {deck_id: 1, user_id: '123', title: 'History of Albania'},
        {deck_id: 2, user_id: '123', title: 'History of Armenia'}
    ];

    beforeEach(() => {
        axios.get.mockClear();
    });

    test('renders profile with user data', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/api/users/')) {
                return Promise.resolve({data: mockUserData});
            }
            if (url.includes('/api/decks/')) {
                return Promise.resolve({data: mockDeckData});
            }
        });

        renderWithAuth(<Profile />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('Stats:')).toBeInTheDocument();
            expect(screen.getByText('Top Wins: 5')).toBeInTheDocument();
            expect(screen.getByText('Total Points: 100')).toBeInTheDocument();
            expect(screen.getByText('Decks Made: 2')).toBeInTheDocument();
        });
    });

    test('handles private profile for other users', async () => {
        const privateUserData = {...mockUserData, Private: true};
        
        axios.get.mockImplementation((url) => {
            if (url.includes('/api/users/')) {
                return Promise.resolve({data: privateUserData});
            }
            if (url.includes('/api/decks/')) {
                return Promise.resolve({data: mockDeckData});
            }
        });

        renderWithAuth(<Profile />, {
            authState: {
                isAuthenticated: true,
                user: '456', // Different user
                userName: 'Other User',
                loading: false
            }
        });

        await waitFor(() => {
            expect(screen.getByText('User profile is private')).toBeInTheDocument();
            expect(screen.queryByText('Stats:')).not.toBeInTheDocument();
        });
    });

    test('handles API errors gracefully', async () => {
        axios.get.mockRejectedValueOnce(new Error('API Error'));

        renderWithAuth(<Profile />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        await waitFor(() => {
            expect(screen.queryByText('Stats:')).not.toBeInTheDocument();
        });
    });
});