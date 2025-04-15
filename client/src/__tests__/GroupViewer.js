import { renderWithAuth, screen } from '../test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupViewer from '../pages/Groups/GroupViewer';

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

    beforeEach(()=>{
        // Set Axios default URL and values
        configureAxios();

        // Setup mocks for each value
        axios.get.mockClear();
        axios.put.mockClear();
        axios.post.mockClear();
        axios.delete.mockClear();
    });

    test('GroupViewer component renders with auth', ()=>{
        // Import render wrapper to pass auth information to Decks
        renderWithAuth(<GroupViewer />, {
            authState: {
            isAuthenticated: true,
            user: '123',
            userName: 'Test User',
            loading: false
            }
        });
    });
});