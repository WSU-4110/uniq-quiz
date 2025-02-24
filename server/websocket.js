const {Server} = require('socket.io');

//Singleton design pattern. Creates single websocket server, exports to app.js to be used by every client.
module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Frontend URL
            methods: ["GET", "POST"], // Allow specific HTTP methods
            //allowedHeaders: ["my-custom-header"], // Optional: if you're using custom headers
            credentials: true // If needed for cookie/session sharing
        }
    });

    io.on("connection", (socket) => {
        console.log("A new client connected");

        socket.on("join_lobby", async ({Game_id, User_id}) => {
            socket.join(Game_id);

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
            io.to(Game_id).emit("player_joined", {User_id, isHost});

            //If host, gives special permissions
            if(isHost){
                io.to(socket.id).emit("host_permissions", {canStartGame: true});
            }
        })
        // Host starts the game
        socket.on("start_game", ({ game_id }) => {
            console.log(`Game ${game_id} started by the host`);
            io.to(game_id).emit("game_started");
        });

        socket.on("disconnect", () =>{
            console.log("Client disconnected");
        })
    })

    console.log('Socket.io server is running.');
};
