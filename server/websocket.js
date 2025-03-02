const {Server} = require('socket.io');
const supabase = require('./supabase.js');
const { cursorTo } = require('readline');

const activeGames = {} //Key: Game_id, Value: Game data (Deck_id, host(bool), User_id)

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Frontend URL
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
            }
        })

        //Host selects a deck
        socket.on("deck_selected", async ({Game_id, Deck_id}) => {
            if(socket.data.host){
                //Verify that host has access to this deck
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
                const {cards, cardError} = await supabase
                    .from("Cards")
                    .select("*")
                    .eq("Deck_id", Deck_id);

                console.log("Cards data retrieved: ", cards);
                if(cardError){
                    console.log("Error retrieving cards: ", cardError.message);
                }

                console.log("Host has selected a deck: ", Deck_id);

                if (!cards || cards.length === 0) {
                    console.log("No cards found for the selected deck.");
                    return;
                }
    
                console.log("Cards retrieved:", cards);

                //Store Deck_id and cards in active games (server data)
                activeGames[Game_id] = {Deck_id, cards, currentCardIndex: 0};
                console.log(activeGames[Game_id]);
            }
        });

        // Host starts the game
        socket.on("start_game", ({ Game_id }) => {
            if(activeGames[Game_id]){
                //Retrieve cards as object for game
                const {cards} = activeGames[Game_id];

                console.log(`Game ${Game_id} started by the host`);

                //Emit game start to all clients
                io.to(Game_id).emit("game_started");
            }
            else{
                console.log("Game not found");
            }
        });
        
        //Host sends card to clients
        socket.on("send_next_card", ({Game_id}) => {
            if(socket.data.host){ //Only host should be able to send cards
                const game = activeGames[Game_id];

                if(game && game.currentCardIndex < game.cards.length){
                    const card = game.cards[currentCardIndex]; //Retrieve card
                    currentCardIndex++; //Increment index to next card

                    console.log("Host sending card: ", card);

                    //Send card to clients
                    io.to(Game_id).emit("card_for_client", card);
                }
                else{
                    console.log("No more cards able to be sent.");
                }
            }
        });

        //Host ends the game
        socket.on("end_game", async ({Game_id}) => {
            if(socket.data.host){
                try{
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

                    io.to(Game_id).emit("game_ended", {message: "Game has ended"});
                }
                catch(error){
                    console.log("Error ending game: ", error.message);
                }
            }
            else{
                console.log("Only the host can end a game.");
            }
        });

        socket.on("disconnect", () =>{
            console.log("Client disconnected");
        });
    })

    console.log('Socket.io server is running.');
};
