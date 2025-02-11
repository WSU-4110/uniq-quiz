const LoggedHeader = ({ toggleHeader }) => {
    return (
      <header>
        <nav className="navi">
          <ul className="navi_list">
            <li className="navi_listItem">
              Join/Host Games
              <ul className="navi_listDrop">
                <li><button className="textButton" onClick={toggleHeader}>Join Game</button></li>
                <li><button className="textButton" onClick={toggleHeader}>Host Game</button></li>
              </ul>
            </li>
  
            <li className="navi_listItem">
              View/Create Decks
              <ul className="navi_listDrop">
                <li><button className="textButton" onClick={toggleHeader}>View Decks</button></li>
                <li><button className="textButton" onClick={toggleHeader}>Create Decks</button></li>
              </ul>
            </li>
  
            <li className="navi_listProfile">
              <div className="box"></div>
              <ul className="navi_listDropProfile">
                <li><button className="textButton" onClick={toggleHeader}>Profile</button></li>
                <li><button className="textButton" onClick={toggleHeader}>Groups</button></li>
                <li><button className="textButton" onClick={toggleHeader}>Log Out</button></li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    );
  };
  
  export default LoggedHeader;