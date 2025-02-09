import './App.css';
import React from 'react';
import { Route, Routes, Link } from "react-router";
import Decks from './pages/Decks.jsx';
import Cards from './pages/Cards.jsx';
import Home from './pages/Home.jsx';
import Navbar from './global/Navbar.jsx';

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/pages/Decks.jsx" element={<Decks />}></Route>
      <Route path="/pages/Cards.jsx" element={<Cards />}></Route>
      <Route path="/pages/Cards/:deck_id" element={<Cards />}></Route>
      <Route path="*" element={<p>Path not resolved</p>} />
    </Routes>
    </>
  );
}

export default App;
