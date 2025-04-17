import { renderWithAuth, screen } from '../test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from '../pages/Auth/UserSettings';
import axios from 'axios';

/**
 * Assignment 5 Unit Tests
 * Author: Trevor Harris
 * Methods tested: 
 *      1. Change Username
 *      2. Change Profile Picture
 *      3. Change Private Status
 *      4. Handles Account Deletion
 *      5. Handles Profile Picture Change
 */

describe('UserSettings', () => {
    const mockUserData = {
        User_id: '123',
        Username: 'Test User',
        Profile_Pic: 'test.jpg',
        Private: false
    };

    beforeEach(() => {
        axios.get.mockClear();
        axios.put.mockClear();
        axios.post.mockClear();
        axios.delete.mockClear();
    });

    test('renders settings with user data', async () => {
        axios.get.mockResolvedValueOnce({data: mockUserData});

        renderWithAuth(<Settings />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        await waitFor(() => {
            expect(screen.getByText('CHANGE USERNAME')).toBeInTheDocument();
            expect(screen.getByText('CHANGE PROFILE PICTURE')).toBeInTheDocument();
            expect(screen.getByText('CHANGE PROFILE STATUS')).toBeInTheDocument();
            expect(screen.getByText('DELETE CURRENT USER ACCOUNT')).toBeInTheDocument();
        });
    });

    test('handles username change', async () => {
        axios.get.mockResolvedValueOnce({data: mockUserData});
        axios.put.mockResolvedValueOnce({});

        const user = userEvent.setup();
        renderWithAuth(<Settings />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        await user.click(screen.getByText('CHANGE USERNAME'));
        const input = screen.getByRole('textbox');
        await user.type(input, 'NewUsername');
        await user.click(screen.getByText('Update Username'));

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                '/api/users/123/username',
                { Username: 'NewUsername' },
                expect.any(Object)
            );
        });
    });

    test('handles profile status change', async () => {
        axios.get.mockResolvedValueOnce({data: mockUserData});
        axios.put.mockResolvedValueOnce({});

        const user = userEvent.setup();
        renderWithAuth(<Settings />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        await user.click(screen.getByText('CHANGE PROFILE STATUS'));
        await user.click(screen.getByText('Set to Private'));

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalled();
        });
    });

    test('handles account deletion', async () => {
        axios.get.mockResolvedValueOnce({data: mockUserData});
        axios.delete.mockResolvedValueOnce({});

        const user = userEvent.setup();
        renderWithAuth(<Settings />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        await user.click(screen.getByText('DELETE CURRENT USER ACCOUNT'));

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(
                '/api/auth/deleteaccount',
                expect.any(Object)
            );
        });
    });

    test('handles profile picture upload', async () => {
        axios.get.mockResolvedValueOnce({data: mockUserData});
        axios.post.mockResolvedValueOnce({status: 200});

        const user = userEvent.setup();
        renderWithAuth(<Settings />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        await user.click(screen.getByText('CHANGE PROFILE PICTURE'));
        
        // Mock file upload
        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const input = screen.getByRole('button', { name: /upload/i });
        await user.upload(input, file);
        await user.click(screen.getByText('Upload'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });
    });
});