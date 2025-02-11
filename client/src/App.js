import React from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Home from "./components/Home";
import Signup from './components/Signup';
import Decks from './pages/Decks.jsx';
import Cards from './pages/Cards.jsx';
import Navbar from './global/Navbar.jsx';

function App() {
  return (
      <div>
          <Navbar/>
          <nav>
              <Link to="/">Home</Link> | {' '}
              <Link to="/signup">Signup</Link>
          </nav>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pages/Decks.jsx" element={<Decks />}></Route>
              <Route path="/pages/Cards.jsx" element={<Cards />}></Route>
              <Route path="/pages/Cards/:card_id" element={<Cards />}></Route>
              <Route path="*" element={<p>Path not resolved</p>} />
          </Routes>
      </div>
  );
}

export default App;
