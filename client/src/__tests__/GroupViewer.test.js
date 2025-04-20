import { renderWithAuth, screen } from '../test-utils.js';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupViewer from '../pages/Groups/GroupViewer.jsx';

import axios from 'axios';
import configureAxios from "../api/config.js";

/**
 * Assignment 5 Unit Tests
 * Author: Keegan Miller
 * Methods tested: 
 *      1. getGroups()
 *      2. component mounts (renderWithAuth)
 *      3. createGroup()
 *      4. joinGroup()
 *      5. getMyGroups()
 *      6. leaveGroup()
 */

describe('GroupViewer', ()=>{
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

    //1
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

        //console.log("AXIOS CALLS", axios.get.mock.calls);

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




    //2
    test('GroupViewer component mounts with auth', async ()=>{
        renderWithAuth(<GroupViewer />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        expect(screen.getByText("Test User")).toBeInTheDocument();
    })




    //3
    test('createGroup correctly calls the api',  async ()=>{
        const mockGroup = {Group_Name: 'Group One', Founder_id: '1234'};

        renderWithAuth(<GroupViewer />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        expect(screen.getByText('Create Group')).toBeInTheDocument();
        await userEvent.click(screen.getByText('Create Group'));

        axios.post.mockResolvedValueOnce(mockGroup);

        await waitFor(()=>{
            expect(axios.post).toHaveBeenCalledWith('/api/groups/', {'Founder_id': '123', 'Group_Name': 'Untitled Group'});
            expect(axios.post).toHaveBeenCalledTimes(1);
        });
    });




    //4
    test('joinGroup correctly calls api', async () => {
        const mockGroups = [
            { Group_id: 1, Group_Name: 'Group One', Founder_id: 1234 }
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

            // Mock clicking the "Find Groups" button
        userEvent.click(screen.getByText('Find Groups'));
    
        // Wait for groups to appear in the DOM
        await waitFor(() => {
            expect(screen.getByText('Group One')).toBeInTheDocument();
            expect(screen.getByText('Join Group')).toBeInTheDocument();
        });

        axios.post.mockResolvedValueOnce({});
        //Click Join Group button
        await userEvent.click(screen.getByText('Join Group'));

        console.log("AXIOS Calls: ", axios.get.mock.calls);
        expect(axios.post).toHaveBeenCalledWith('api/groupMembership', {"Group_id": 1, "User_id": "123"});

        screen.debug();
    
        expect(axios.get).toHaveBeenCalledWith('/api/groups/');
        expect(axios.get).toHaveBeenCalledTimes(2)
    });




    //5
    test('getMyGroups properly calls api', async () => {
        const mockGroups = [
            { Group_id: 1, Group_Name: 'Group One', Founder_id: 1234 }
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

            // Mock clicking the "Find Groups" button -> Triggers getMyGroups
        userEvent.click(screen.getByText('Find Groups'));
    
        // Wait for groups to appear in the DOM
        await waitFor(() => {
            expect(screen.getByText('Group One')).toBeInTheDocument();
            expect(screen.getByText('Join Group')).toBeInTheDocument();
        });

        console.log("AXIOS Calls: ", axios.get.mock.calls);

        expect(axios.get).toHaveBeenCalledWith('/api/groupMembership/member/123');
    });




    //6
    test('leaveGroup correctly calls api', async() =>{
        const mockGroups = [
            { Group_id: 1, Group_Name: 'Group One', Founder_id: 1234 },
            { Group_id: 2, Group_Name: 'Group Two', Founder_id: 5678 }
        ];
    
        const mockMemberships = [
            { Group_id: 1, User_id: '123' } // User is only in Group One
        ];
    
        axios.get.mockResolvedValueOnce({ data: mockGroups }).mockResolvedValueOnce({data: mockMemberships});
    
        renderWithAuth(<GroupViewer />, {
            authState: {
                isAuthenticated: true,
                user: '123',
                userName: 'Test User',
                loading: false
            }
        });

        // // Mock clicking the "Find Groups" button -> Triggers getMyGroups
        // userEvent.click(screen.getByText('Find Groups'));
    
        // // // // Wait for groups to appear in the DOM
        // await waitFor(() => {
        //     expect(screen.getByText('Group One')).toBeInTheDocument();
        //     expect(screen.getByText('Join Group')).toBeInTheDocument();
        // });

        // axios.get.mockResolvedValueOnce({"Group_id": "1", "Group_Name": "Group One"});
        // await userEvent.click(screen.getByText('View My Groups'));
        await waitFor(() => {
            expect(screen.getByText('Leave This Group')).toBeInTheDocument();
            expect(screen.queryByText('Group Two')).not.toBeInTheDocument();
        });

        axios.delete.mockResolvedValueOnce({});
        await userEvent.click(screen.getByText('Leave This Group'));

        console.log("AXIOS Calls: ", axios.get.mock.calls);

        expect(axios.get).toHaveBeenCalledTimes(2);

        //Expect axios.delete to have been called with the correct api route
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(axios.delete).toHaveBeenCalledWith('api/groupMembership/', {"data": {"Group_id": 1, "User_id": "123"}});
        screen.debug();
    });
});