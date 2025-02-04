import './App.css';
import React from 'react';
import { Route, Routes, Link } from "react-router";
import Decks from './pages/Decks/Decks.jsx';
import Home from './pages/Home/Home.jsx';
import Navbar from './global/Navbar.jsx';

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/pages/Decks.jsx" element={<Decks />}></Route>
      <Route path="*" element={<p>Path not resolved</p>} />
    </Routes>
    </>
  );
}

export default App;
