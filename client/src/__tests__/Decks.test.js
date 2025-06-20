import { renderWithAuth, screen } from '../test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Decks from '../pages/Decks/Decks';

import axios from 'axios';
import configureAxios from "../api/config.js";

/**
 * Assignment 5 Unit Tests
 * Author: Hayley Spellicy-Ryan
 * Methods tested: 
 *      1. Decks()
 *      2. getDecks()
 *      3. createDeck()
 *      4. updateDeck()
 *      5. deleteDeck()
 */

describe('Decks', ()=>{
    // Mock data for reference
    const mockDecks = [
        {deck_id: 1, user_id: '123', title: 'History of Albania'},
        {deck_id: 2, user_id: '123', title: 'History of Armenia'},
        {deck_id: 3, user_id: '123', title: 'Top 10 Anime Battles'}
    ];

    beforeEach(()=>{
        // Set Axios default URL and values
        configureAxios();

        // Setup mocks for each value
        axios.get.mockClear();
        axios.put.mockClear();
        axios.post.mockClear();
        axios.delete.mockClear();
    });

    test('Decks component renders with auth', ()=>{
        // Import render wrapper to pass auth information to Decks
        renderWithAuth(<Decks />, {
            authState: {
            isAuthenticated: true,
            user: '123',
            userName: 'Test User',
            loading: false
            }
        });
        
        // Check if username displays on screen (similar test to ProfileBanner > renders username when logged in)
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    test('GetDecks renders proper decks', async()=>{
        // Simulate the return value of get command
        axios.get.mockResolvedValueOnce({data: mockDecks});

        // Import render wrapper to pass auth information to Decks
        renderWithAuth(<Decks />, {
            authState: {
            isAuthenticated: true,
            user: '123',
            userName: 'Test User',
            loading: false
            }
        });

        // Wait for API call, then check if screen state matches dummy data
        await waitFor(()=>{
            expect(screen.getByText('History of Albania')).toBeInTheDocument();
            expect(screen.getByText('History of Armenia')).toBeInTheDocument();
            expect(screen.getByText('Top 10 Anime Battles')).toBeInTheDocument();
        })

        // Check if correct request was called
        expect(axios.get).toHaveBeenCalledTimes(2);
        expect(axios.get).toHaveBeenCalledWith(`/api/decks/123/user_decks`);
    });

    test('Update deck title changes UI and calls API', async()=>{
        const mockUpdateDeck = [
            {deck_id: 1, user_id: '123', title: 'History of Albania'},
        ];
        const user = userEvent.setup();

        // Simulate the return value of get command
        axios.get.mockResolvedValueOnce({data: mockDecks});

        renderWithAuth(<Decks />, {
            authState: {
            isAuthenticated: true,
            user: '123',
            userName: 'Test User',
            loading: false
            }
        });

        // Verify that text renders
        await waitFor(()=>{
            expect(screen.getByText('History of Albania')).toBeInTheDocument();
        });

        // Trigger clicks to select a deck
        await user.click(screen.getByText('History of Albania'));

        // Selected deck changed, so refresh deck value
        axios.get.mockResolvedValueOnce({data: mockDecks});

        // Check that edit button exists
        expect(screen.getByText('Edit')).toBeInTheDocument();

        // Trigger edit button click
        await user.click(screen.getByText('Edit'));

        // Check that input field exists
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();

        // Check that input field can clear content and replace with new content
        await userEvent.clear(input);
        await userEvent.type(input, 'History of Anime');
        expect(input).toHaveValue('History of Anime');

        // Trigger save button click
        await user.click(screen.getByText('Save'));

        // Check if correct API request was called
        expect(axios.put).toHaveBeenCalledTimes(2);
        expect(axios.put.mock.calls).toEqual([
            ["api/decks/1", {"Title": "History of Albania"}, ], // First call from Edit click
            ["api/decks/1", {"Title": "History of Anime"}]  // Second call from Save click
          ]);

        // Check that screen updates
        expect(screen.getByText('History of Anime')).toBeInTheDocument();
    });

    test('Create deck changes UI and calls API', async()=>{
        const mockNewDeck = { User_id: '123', Title: "Untitled Deck"};

        const user = userEvent.setup();

        axios.get.mockResolvedValueOnce({data: mockDecks});

        renderWithAuth(<Decks />, {
            authState: {
            isAuthenticated: true,
            user: '123',
            userName: 'Test User',
            loading: false
            }
        });
    
        // Establish that Untitled Deck is not in the current decks
        expect(screen.queryByText('Untitled Deck')).not.toBeInTheDocument();

        // Mock post response
        axios.post.mockResolvedValueOnce({data: mockNewDeck});

        // Mock get response (after post)
        const newMockDecks = [...mockDecks, mockNewDeck];
        axios.get.mockResolvedValueOnce({data: newMockDecks});

        // Trigger clicks to create a deck
        await user.click(screen.getByText('Add Deck'));

        // Check if correct API request was called
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith('/api/decks', {"Title": "Untitled Deck", "User_id": "123"});

        // Check if get API request was called
        await waitFor(()=>{
            expect(axios.get).toHaveBeenCalledTimes(3); //First call at start (twice), second call on refresh change
        });
        expect(axios.get.mock.calls).toEqual([
            ['/api/decks/123/user_decks'],
            ['/api/userLikedDecks/123'],
            ['/api/decks/123/user_decks']
          ]);

    });
    test('Delete deck calls API', async()=>{
        const user = userEvent.setup();

        axios.get.mockResolvedValueOnce({data: mockDecks});

        renderWithAuth(<Decks />, {
            authState: {
            isAuthenticated: true,
            user: '123',
            userName: 'Test User',
            loading: false
            }
        });

        // Verify that text renders
        await waitFor(()=>{
            expect(screen.getByText('History of Albania')).toBeInTheDocument();
        });

        // Mock delete response
        axios.delete.mockResolvedValueOnce({data: {Deck_id: 3, Title: 'Top 10 Anime Battles'}});

        // Trigger clicks to delete a deck
        await user.click(screen.getByText('Top 10 Anime Battles'));

        // Selected deck changed, so refresh deck value
        axios.get.mockResolvedValueOnce({data: mockDecks});

        // Check that delete button exists
        expect(screen.getByText('Delete This Deck')).toBeInTheDocument();

        // Trigger delete button click
        await user.click(screen.getByText('Delete This Deck'));
        await user.click(screen.getByText('Delete'));

        // Check if correct API response was called
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(axios.delete).toHaveBeenCalledWith('api/decks/3');
    });
    test('Decks handles empty getDecks gracefully', async ()=>{
        axios.get.mockResolvedValueOnce({data: []});

        renderWithAuth(<Decks />, {
            authState: {
            isAuthenticated: true,
            user: '123',
            userName: 'Test User',
            loading: false
            }
        });

        // Wait for API call, then check if none of the data renders
        await waitFor(()=>{
            expect(screen.queryByText('History of Albania')).not.toBeInTheDocument();
            expect(screen.queryByText('History of Armenia')).not.toBeInTheDocument();
            expect(screen.queryByText('Top 10 Anime Battles')).not.toBeInTheDocument();
        })

        // Check if correct request was called
        expect(axios.get).toHaveBeenCalledTimes(2);
        expect(axios.get.mock.calls).toEqual([
            ["/api/decks/123/user_decks"],
            ["/api/userLikedDecks/123"] 
          ]);
    });
})