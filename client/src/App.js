import React from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Home from "./components/Home";
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Navbar from './global/Navbar.jsx';
import Decks from './pages/Decks/Decks.jsx';
import Cards from './pages/Decks/Cards.jsx';
import Join from './pages/Game/Join.jsx';
import  Host from './pages/Game/Host.jsx';
import UserSettings from './pages/Auth/UserSettings';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  return (
        <div className="application">
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/decks" element={<Decks />}></Route>
                <Route path="/cards" element={<Cards />}></Route>
                <Route path="/cards/:card_id" element={<Cards />}></Route>
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/host" element={<Host />} />
                <Route path="/settings" element={<UserSettings />} />
                <Route path="*" element={<p>Path not resolved</p>} />
            </Routes>
        </div>
  );
}

export default App;