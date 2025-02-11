
import React from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Home from "./components/Home";
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Navbar from './global/Navbar.jsx';
import Decks from './pages/Decks/Decks.jsx';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  return (
    <BrowserRouter>
        <div className="application">
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/pages/Decks.jsx" element={<Decks />}></Route>
                <Route path="*" element={<p>Path not resolved</p>} />
            </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
