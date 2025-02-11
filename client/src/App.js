import React from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css.old';
import axios from 'axios';
import Home from "./components/Home.jsx";
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Navbar from './global/Navbar.jsx';
import Decks from './pages/Decks.jsx';
import Cards from './pages/Cards.jsx';

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
            <Route path="/pages/Decks.jsx" element={<Decks />}></Route>
            <Route path="/pages/Cards.jsx" element={<Cards />}></Route>
            <Route path="/pages/Cards/:card_id" element={<Cards />}></Route>
            <Route path="*" element={<p>Path not resolved</p>} />
        </Routes>
    </div>
  );
}

export default App;
