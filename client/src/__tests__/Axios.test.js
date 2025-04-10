// Axios imports
import axios from 'axios';
import configureAxios from "../api/config.js";

/**
 * Assignment 5 Unit Tests
 * Author: Hayley Spellicy-Ryan
 * Methods tested: 
 *      1. configureAxios()
 */

describe('Axios Setup', ()=>{
  test('axios is configured correctly', () => { 
    configureAxios();
    
    expect(axios.defaults.withCredentials).toBe(true);
    expect(axios.defaults.headers.common['Content-Type']).toBe('application/json');
    expect(axios.defaults.baseURL).toBe(process.env.REACT_APP_API_URL);
  });
});