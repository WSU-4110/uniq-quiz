import React from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Home from "./components/Home";
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  return (
    <BrowserRouter>
        <div className="ALCOHOL">
            <nav>
                <Link to="/">Home</Link> | {' '}
                <Link to="/signup">Signup</Link> | {' '}
                <Link to="/login">Login</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
