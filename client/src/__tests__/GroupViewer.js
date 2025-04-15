import { renderWithAuth, screen } from '../test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupViewer from '../pages/Groups/GroupViewer';

import axios from 'axios';
import configureAxios from "../api/config.js";

/**
 * Assignment 5 Unit Tests
 * Author: Keegan Miller
 * Methods tested: 
 *      1. getGroups()
 *      2. createGroup()
 *      3. deleteGroup()
 *      4. leaveGroup()
 *      5. viewGroup()
 *      6. joinGroup()
 */

describe('Decks', ()=>{
    // Mock data for reference

    beforeEach(()=>{
        // Set Axios default URL and values
        configureAxios();

        // Setup mocks for each value
        axios.get.mockClear();
        axios.put.mockClear();
        axios.post.mockClear();
        axios.delete.mockClear();
    });

    test('getGroups fetches and displays all groups', async () => {
        const mockGroups = [
            { Group_id: 1, Group_Name: 'Group One', Founder_id: 1234 },
            { Group_id: 2, Group_Name: 'Group Two', Founder_id: 5678 }
        ];
    
        axios.get.mockResolvedValueOnce({ data: mockGroups });
    
        renderWithAuth(<GroupViewer />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        console.log("AXIOS CALLS", axios.get.mock.calls);

            // Mock clicking the "Find Groups" button
        userEvent.click(screen.getByText('Find Groups'));
    
        // Wait for groups to appear in the DOM
        await waitFor(() => {
            expect(screen.getByText('Group One')).toBeInTheDocument();
            expect(screen.getByText('Group Two')).toBeInTheDocument();
        });
    
        expect(axios.get).toHaveBeenCalledWith('/api/groups/');
        expect(axios.get).toHaveBeenCalledTimes(2)
    });

    // test('',  ()=>{

    // })

    // test('',  ()=>{

    // })

    // test('',  ()=>{

    // })

    // test('',  ()=>{

    // })
});