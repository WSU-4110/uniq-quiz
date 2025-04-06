const {Server} = require('socket.io');
const supabase = require('./supabase.js');
const { cursorTo } = require('readline');

//TODO: add gamesettings
/**
 * Key: Game_id
 * Value:   Deck_id,
 *          cards,
 *          currentCardIndex,
 *          timer,
 *          players[{User_id (uuid), Username (int), Player_score (int), CurrentSubmitAnswer(bool)}]
 */
const activeGames = {};

function CalcPlayerScore(isQuestionCorrect, position, totalPos){
    const positionReversed = totalPos - position;
    var normalizedPosition = positionReversed / totalPos;
    normalizedPosition = Math.abs(normalizedPosition);

    var correctScore = (1000 * normalizedPosition) + 1000;
    var positionScore = normalizedPosition * 100;
    return ( Math.ceil(isQuestionCorrect ? correctScore : positionScore));
}

module.exports = (server) => {
    console.log("Initializing Socket.IO...");
    const io = new Server(server, {
        cors: {
            origin: process.env.INPUT_PORT, // Frontend URL
            methods: ["GET", "POST", "DELETE"], // Allow specific HTTP methods
            //allowedHeaders: ["my-custom-header"], // Optional: if you're using custom headers
            credentials: true // If needed for cookie/session sharing
        }
    });

    io.on("connection", (socket) => {
        console.log("A new client connected");

        socket.on("join_lobby", async ({Game_id, User_id, Username}) => {
            socket.join(Game_id);
            socket.data.User_id = User_id; //Store User_id in the socket emission
            socket.data.host = false; //Set false, until proven to be host
            socket.data.Username = Username;
            console.log("Received join_lobby");

            // Check if the player is the host
            const { data, error } = await supabase
            .from("Games")
            .select("Host_id")
            .eq("Game_id", Game_id)
            .single();

            if(error){
                console.log("Error fetching game: ", error.message);
                return;
            }

            const isHost = data.Host_id === User_id;
            console.log(`Player ${User_id} joined lobby ${Game_id} (Host: ${isHost})`);

            //Notify all players in lobby that someone has joined
            io.to(Game_id).emit("player_joined", {User_id, isHost, Username});

            //If host, gives special permissions
            if(isHost){
                socket.data.host = true;
                io.to(socket.id).emit("host_permissions", {canStartGame: true});
                //initialize empty game
                activeGames[Game_id] = {Deck_id: null, cards: null, currentCardIndex: 0, players: []};
            }

            //Store player data in active game
            activeGames[Game_id].players.push({
                User_id: User_id,
                Username: Username,
                Player_score: 0,
                CurrentSubmitAnswer: null,
            });
        })

        //Host selects a deck
        socket.on("game_settings_selected", async ({Game_id, Game_Settings}) => {
            if(socket.data.host){
                //Verify that host has access to this deck
                console.log("Using ID: ", socket.data.User_id);
                console.log("Using settings: ", Game_Settings);

                const Deck_id = Game_Settings.selectedDeck.Deck_id;
                const Timer = Game_Settings.timePerQuestion;
                const deck_name = Game_Settings.selectedDeck.Title;
                console.log(`Game data:;\nDeck_name: ${deck_name}\nDeck_id: ${Deck_id}\nDeck Timer${Timer}`);

                const {data, error} = await supabase
                    .from("Decks")
                    .select("Deck_id")
                    .eq("Deck_id", Deck_id)
                    .eq("User_id", socket.data.User_id) 
                    .single();
                
                if(error){
                    console.log("Error selecting deck", error.message);
                    return;
                }
                console.log("Deck data: ", data);

                //Retrieve card data
                const {data: cards, error: cardError} = await supabase
                    .from("Cards")
                    .select("*")
                    .eq("Deck_id", Deck_id)
                    .order("Card_id");

                console.log("Cards data retrieved: ", cards);
                if(cardError){
                    console.log("Error retrieving cards: ", cardError.message);
                }

                console.log("Host has selected a deck: ", Deck_id);

                if (!cards || cards.length === 0) {
                    console.log("No cards found for the selected deck.");
                    return;
                }

                //Shuffle cards
                if(Game_Settings.shuffleDecks){
                    for(let i = cards.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [cards[i], cards[j]] = [cards[j], cards[i]];
                    }
                }
    
                console.log("Cards retrieved:", cards);

                //Store Deck_id and cards in active games (server data)
                activeGames[Game_id].Deck_id = Deck_id;
                activeGames[Game_id].cards = cards;
                activeGames[Game_id].timer = Timer;
                activeGames[Game_id].deck_name = deck_name;

                console.log("Active Games: ", activeGames[Game_id]);
            }
        });

        //Socket to retrieve game settings upon page loading
        socket.on("get_game_settings", async ({Game_id}) =>{
            //Get current ID from activeGames
            const Deck_id = activeGames[Game_id].Deck_id;
            const Timer = activeGames[Game_id].timer;
            const deckTitle = activeGames[Game_id].deck_name;

            console.log(`Sending Data { \nDeck_Title: ${deckTitle}\nTimer: ${Timer}\n}`);

            //Emit title as event to all clients connected to Game_id
            io.to(Game_id).emit("game_settings", {Deck_Title: deckTitle, Timer: Timer});
        })
        


        // Host starts the game
        socket.on("start_game", ({ Game_id }) => {
            if(activeGames[Game_id]){
                //Retrieve cards as object for game
                const {cards} = activeGames[Game_id];

                console.log(`Game ${Game_id} started by the host`);

                //Emit game start to all clients
                console.log(activeGames[Game_id].players);
                io.to(Game_id).emit("game_started");
            }
            else{
                console.log("Start game: Game not found");
            }
        });

        //Game Initialization,
        socket.on("init_game_call", ({Game_id, User_id}) => {
            console.log("Step 1: Host initialization");
            io.to(Game_id).emit("init_game_part_1", {playerList: activeGames[Game_id].players, playerCount: activeGames[Game_id].players.length});
        })

        socket.on("connect_game", ({Game_id, User_id}) => {
            console.log(`Step 2: User connecting ${User_id}`);
            io.to(Game_id).emit("player_connect", {Game_id, User_id});
        })

        socket.on("confirm_connection", ({Game_id, User_id}) => {
            console.log(`Step 2.5: Confirm User ${User_id}`);
            io.to(Game_id).emit("player_confirm", {Game_id, User_id});
        })

        socket.on("init_game_call_2", ({Game_id}) => {
            console.log("Step 3: Player initialization");
            io.to(Game_id).emit("init_game_part_2", {playerList: activeGames[Game_id].players, playerCount: activeGames[Game_id].players.length});
        })
        
        //  Gameplay mechanics  //

        //Host sends card to clients
        socket.on("send_next_card", ({Game_id}) => {
            if(socket.data.host){ //Only host should be able to send cards
                const game = activeGames[Game_id];

                if(game && game.currentCardIndex < game.cards.length){
                    const card = game.cards[game.currentCardIndex]; //Retrieve card

                    console.log("Host sending card: ", card);
                    console.log("Host sending index: ", game.currentCardIndex);

                    //Send card to clients
                    io.to(Game_id).emit("card_for_client", {Card: card, CardIndex: game.currentCardIndex});
                    game.currentCardIndex++; //Increment index to next card
                }
                else{
                    io.to(Game_id).emit("card_for_client", {Card: {}, CardIndex: -999});
                    console.log("No more cards able to be sent.");
                    if(!game) console.log("No game detected.");
                    else console.log("Current card is out of bounds.");
                }
            }
        });

        //Host moves on to next question
        socket.on("end_question", ({Game_id}) => {
            if(socket.data.host){ //Only host can move to next game state
                console.log("End question", activeGames[Game_id].players);
                io.to(Game_id).emit("question_ended", {Scores: Object.values(activeGames[Game_id].players)});
            }
        })

        //Player submits answer
        socket.on("submit_answer", ({Game_id, Player_id, Answer_id, Timer_Status}) => {
            let position = Object.values(activeGames[Game_id].players).filter(player => player.CurrentSubmitAnswer !== null).length + 1;
            let totalPos = activeGames[Game_id].players.length + 1;

            io.to(Game_id).emit("check_answer", {Player_id: Player_id, Answer_id: Answer_id, position: position, totalPos: totalPos})
        })

        //Host brodcasts score
        socket.on("broadcast_score", ({Game_id, Score, User_id}) => {
            io.to(Game_id).emit("broadcast_score_client", {User_id: User_id, Score: Score});
        })

        //Host tells player what state to be in
        socket.on("send_current_state", ({Game_id, currentState, isGameOver}) => {
            io.to(Game_id).emit("get_current_state", {currentState: currentState, isGameOver: isGameOver});
        })

        //Host ends the game
        socket.on("end_game", async ({Game_id}) => {
            if(socket.data.host){ //Make sure only host has access to this function
                try{
                    //send game end message to clients before disconnecting
                    io.to(Game_id).emit("game_ended", {message: "Game has ended"});

                    //Get all clients connected to host
                    const clients = await io.in(Game_id).fetchSockets();
                    
                    //Disconnect each client from game
                    clients.forEach((socket) =>{
                        socket.leave(Game_id);
                    });

                    //Delete game from server storage
                    delete activeGames[Game_id];

                    //Delete game from database
                    const {error} = await supabase
                        .from("Games")
                        .delete()
                        .eq("Game_id", Game_id);
                    if(error){
                        console.log("Error deleting game from database: ", error.message);
                    }
                    else{
                        console.log(`Game ${Game_id} has ended and been removed from database.`);
                    }
                }
                catch(error){
                    console.log("Error ending game: ", error.message);
                }
            }
            else{
                console.log("Only the host can end a game.");
            }
        });

        //On client disconnect
        socket.on("disconnect", () =>{
            console.log("Client disconnected");
        });
    })

    //Runs to let us know server is active
    console.log('Socket.io server is running.');
};
