import React from 'react';

function GuestHeader(){
    return(
      <header>
        <nav class = "navi">
          <ul class = "navi_list">
            <li class = "navi_listItem">
              <a href="https://www.reddit.com/r/halo/comments/in1zab/halo_3_rat_is_a_good_little_boi/" target="_blank"> Join Game </a></li>
              
            <li class = "navi_listItem"> Sign Up/Log in
              <ul class = "navi_listDrop">
                <li><Link to="/signup"> Sign Up </Link></li>
                <li><a href="https://www.reddit.com/r/halo/comments/in1zab/halo_3_rat_is_a_good_little_boi/" target="_blank"> Log In </a></li>
              </ul>
            </li>
              
            <li class = "navi_listProfile">
              <div class = "box"> </div>
              <ul class = "navi_listDropProfile">
                <li><Link to="/signup"> Sign Up </Link></li>
                <li><a href="https://www.reddit.com/r/halo/comments/in1zab/halo_3_rat_is_a_good_little_boi/" target="_blank"> Log In </a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
  
  
  export default GuestHeader