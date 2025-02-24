const {Server} = require('socket.io');
const supabase = require('./supabase');


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

        socket.on("join_lobby", async ({Join_Code, User_id}) => {
            socket.join(Join_Code);

            // Check if the player is the host
            let { data, error } = await supabase
            .from("Games")
            .select("Host_id")
            .eq("Join_Code", Join_Code)
            .single();

            if (error || !data) {
                // If no game exists, create a new one with the current player as the host
                const { data: newGame, error: insertError } = await supabase
                    .from("Games")
                    .insert([{ Join_Code: Join_Code, Host_id: User_id }]);
        
                if (insertError) {
                    console.log("Error creating game: ", insertError.message);
                    return;
                }

                console.log(data);
        
                data = { Host_id: User_id }; // Treat this player as the host
            }

            const isHost = data.Host_id === User_id;
            console.log(`Player ${User_id} joined lobby ${Join_Code} (Host: ${isHost})`);

            //Notify all players in lobby that someone has joined
            io.to(Join_Code).emit("player_joined", {User_id, isHost});

            //If host, gives special permissions
            if(isHost){
                io.to(socket.id).emit("host_permissions", {canStartGame: true});
            }
        })
        // Host starts the game
        socket.on("start_game", ({ Join_Code }) => {
            console.log(`Game ${Join_Code} started by the host`);
            io.to(Join_Code).emit("game_started");
        });

        socket.on("disconnect", () =>{
            console.log("Client disconnected");
        })
    })

    console.log('Socket.io server is running.');
};
