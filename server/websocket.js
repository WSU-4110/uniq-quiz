const {Server} = require('socket.io');

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://127.0.0.1:5500", // Frontend URL
            methods: ["GET", "POST"], // Allow specific HTTP methods
            //allowedHeaders: ["my-custom-header"], // Optional: if you're using custom headers
            credentials: true // If needed for cookie/session sharing
        }
    });

    io.on("connection", (socket) => {
        console.log("A new client connected");

        socket.on("message", (message) => {
            console.log(`Received: ${message}`);
            socket.broadcast.emit("message", message);
        })

        socket.on("disconnect", () =>{
            console.log("Client disconnected");
        })
    })

    console.log('Socket.io server is running.');
};
