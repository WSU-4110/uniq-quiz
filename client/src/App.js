import React from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Home from "./components/Home";
import Signup from './components/Signup';

function App() {
  return (
    <BrowserRouter>
        <div>
            <nav>
                <Link to="/">Home</Link> | {' '}
                <Link to="/signup">Signup</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
