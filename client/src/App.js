import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider, useAuth} from './context/AuthContext.jsx';  
import axios from 'axios';
import Home from "./pages/Home/Home.jsx";
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Navbar from './components/Navbar.jsx';
import Decks from './pages/Decks/Decks.jsx';
import Cards from './pages/Decks/Cards.jsx';
import Lobby from './pages/Game/Lobby.jsx';
import UserSettings from './pages/Auth/UserSettings';
import Landing from './pages/Home/Landing.jsx';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'http://localhost:3000/';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
      return <p>Loading...</p>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RootLayout() {
  const {isAuthenticated} = useAuth();
  const [sidebar, setSidebar] = React.useState(true);

  return (
        <div className="application">
          {isAuthenticated && <Navbar sidebar={sidebar} setSidebar={setSidebar} />}
          <div className={isAuthenticated ? (sidebar ? "body" : "bodyNX") : "bodyFull"}>
              <Routes>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/lobby" element={<Lobby />} />
                  <Route path="/" element={<Landing/>} />
              
                  <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/decks" element={<ProtectedRoute><Decks /></ProtectedRoute>}></Route>
                  <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>}></Route>
                  <Route path="/cards/:card_id" element={<ProtectedRoute><Cards /></ProtectedRoute>}></Route>
                  <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" />} />
              </Routes>
          </div>
        </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <RootLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;