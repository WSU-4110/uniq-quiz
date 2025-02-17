
import React from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Home from "./components/Home.jsx";
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
  const [sidebar, setSidebar] = React.useState(false);

  return (
        <div className="application">
            <Navbar sidebar={sidebar} setSidebar={setSidebar}/>
            <div className={sidebar ? "body" : "bodyNX"}>
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
        </div>
  );
}

export default App;
