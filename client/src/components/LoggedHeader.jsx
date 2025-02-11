import React from 'react';

function LoggedHeader(){
    return(
        <header>
            <nav class = "navi">
                <ul class = "navi_list">
                    <li class = "navi_listItem"> Join/Host Games 
                        <ul class = "navi_listDrop">
                        <li><a href="https://www.reddit.com/r/halo/comments/in1zab/halo_3_rat_is_a_good_little_boi/" target="_blank"> Join Game </a></li>
                        <li><a href="https://www.reddit.com/r/halo/comments/in1zab/halo_3_rat_is_a_good_little_boi/" target="_blank"> Host Game </a></li>
                        </ul>
                    </li>
                        
                    <li class = "navi_listItem"> View/Create Decks
                        <ul class = "navi_listDrop">
                        <li><a href="https://www.reddit.com/r/halo/comments/in1zab/halo_3_rat_is_a_good_little_boi/" target="_blank"> View Decks </a></li>
                        <li><a href="https://www.reddit.com/r/halo/comments/in1zab/halo_3_rat_is_a_good_little_boi/" target="_blank"> Create Decks </a></li>
                        </ul>
                    </li>
                        
                    <li class = "navi_listProfile">
                        <div class = "box"> </div>
                        <ul class = "navi_listDropProfile">
                        <li><a href="https://www.reddit.com/r/halo/comments/in1zab/halo_3_rat_is_a_good_little_boi/" target="_blank"> Profile </a></li>
                        <li><a href="https://www.reddit.com/r/halo/comments/in1zab/halo_3_rat_is_a_good_little_boi/" target="_blank"> Groups </a></li>
                        <li><a href="https://www.reddit.com/r/halo/comments/in1zab/halo_3_rat_is_a_good_little_boi/" target="_blank"> Log Out </a></li>
                        </ul>
                    </li> 
                </ul>
            </nav>
        </header>
    );
}


export default LoggedHeader