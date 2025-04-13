import {useState, useEffect} from "react";
import {AuthProvider, useAuth} from './context/AuthContext.jsx';  
import {SocketProvider} from './context/SocketContext.jsx';
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import configureAxios from './api/config.js';
import Home from "./pages/Home/Home.jsx";
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Navbar from './components/Navbar.jsx';
import Decks from './pages/Decks/Decks.jsx';
import Cards from './pages/Decks/Cards.jsx';
import Host from './pages/Game/Host.jsx';
import Join from './pages/Game/Join.jsx';
import Profile from './pages/Profile/Profile.jsx';
import UserSettings from './pages/Auth/UserSettings';
import Landing from './pages/Home/Landing.jsx';
import PlayerGame from "./pages/Game/PlayerGame";
import HostGame from "./pages/Game/HostGame";
import GroupViewer from './pages/Groups/GroupViewer.jsx';
import Group from './pages/Groups/Group.jsx';

configureAxios();

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
      return <p>Loading...</p>;
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function RootLayout() {
  const {isAuthenticated} = useAuth();
  const location = useLocation();
  const [sidebar, setSidebar] = useState(true);
  const [isGame, setIsGame] = useState(false);


  //path listener
  useEffect(() => {
      if (
          location.pathname.startsWith("/join") ||
          location.pathname.startsWith("/host")
      ) {
          setIsGame(true);
      } else {
          setIsGame(false);
      }
  }, [location.pathname])

  return (
        <div className="application">
          {isAuthenticated && !isGame && <Navbar sidebar={sidebar} setSidebar={setSidebar} />}
          <div className={isAuthenticated && !isGame ? (sidebar ? "body" : "bodyNX") : "bodyFull"}>
              <Routes>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={ isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing/>} />
                  <Route path="/game" element={<PlayerGame />} />
              
                  <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/decks" element={<ProtectedRoute><Decks /></ProtectedRoute>}></Route>
                  <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>}></Route>
                  <Route path="/groups" element={<ProtectedRoute><GroupViewer /></ProtectedRoute>}></Route>
                  <Route path="/groups/:Group_id" element={<ProtectedRoute><Group /></ProtectedRoute>}></Route>
                  <Route path="/cards/:card_id" element={<ProtectedRoute><Cards /></ProtectedRoute>}></Route>
                  <Route path="/profile/:User_id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />

                  <Route path="/join" element={<ProtectedRoute><Join /></ProtectedRoute>} />
                  <Route path="/join/lobby" element={<ProtectedRoute><Join /></ProtectedRoute>} />
                  <Route path="/join/:Game_id" element={<ProtectedRoute><PlayerGame /></ProtectedRoute>} />
                  <Route path="/host/start" element={<ProtectedRoute><Host /></ProtectedRoute>} />
                  <Route path="/host/:Game_id" element={<ProtectedRoute><HostGame /></ProtectedRoute>} />

                  <Route path="*" element={<Navigate to="/" />} />
              </Routes>
          </div>
        </div>
  );
}

function App() {
  return (
    <AuthProvider>
    <SocketProvider>
      <Router>
        <RootLayout />
      </Router>
    </SocketProvider>
    </AuthProvider>
  );
}

export default App;