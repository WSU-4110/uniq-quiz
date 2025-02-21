const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });
    let clients = []; // Array to store connected clients

    wss.on('connection', (ws) => {
        console.log('A new client connected');
        clients.push(ws); // Add new client to the list
        console.log("Connected clients: ", clients.length);

        // Broadcast received message to all clients
        ws.on('message', (message) => {
            console.log(`Console Received: ${message}`);
            // Broadcast to all connected clients except the sender
            clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(`Received: ${message}`);
                }
            });
        });

        // Handle client disconnection
        ws.on('close', () => {
            console.log('Client disconnected');
            clients = clients.filter(client => client !== ws); // Remove client from list
        });
    });

    console.log('WebSocket server is running.');
};
