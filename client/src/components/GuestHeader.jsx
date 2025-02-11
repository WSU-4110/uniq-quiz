const GuestHeader = ({ toggleHeader }) => {
  return (
    <header>
      <nav className="navi">
        <ul className="navi_list">
          <li className="navi_listItem">
            <button className="textButton" onClick={toggleHeader}>Join Game</button>
          </li>

          <li className="navi_listItem">
            Sign Up/Log In
            <ul className="navi_listDrop">
              <li><button className="textButton" onClick={toggleHeader}>Sign Up</button></li>
              <li><button className="textButton" onClick={toggleHeader}>Log In</button></li>
            </ul>
          </li>

          <li className="navi_listProfile">
            <div className="box"></div>
            <ul className="navi_listDropProfile">
              <li><button className="textButton" onClick={toggleHeader}>Sign Up</button></li>
              <li><button className="textButton" onClick={toggleHeader}>Log In</button></li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default GuestHeader;