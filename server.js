// // server.js

const WebSocket = require('ws');

// Initialize WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server running on ws://localhost:8080');

wss.on('connection', (ws) => {
    console.log('A user connected');

    // Listen for messages from the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('A user disconnected');
    });
});




// const WebSocket = require('ws');
// const url = require('url');

// const wss = new WebSocket.Server({ port: 8080 });

// console.log('WebSocket server running on ws://localhost:8080');

// const clients = new Map(); // Store connected users

// wss.on('connection', (ws, req) => {
//     const params = url.parse(req.url, true).query;
//     const userId = params.userId; // Extract user ID from query params

//     if (!userId) {
//         ws.close();
//         return;
//     }

//     clients.set(userId, ws);
//     console.log(`User ${userId} connected`);

//     // Broadcast to all clients that this user is online
//     broadcastStatus(userId, true);

//     // Handle incoming messages (optional)
//     ws.on('message', (message) => {
//         console.log(`Received from ${userId}: ${message}`);
//     });

//     // Handle disconnection
//     ws.on('close', () => {
//         console.log(`User ${userId} disconnected`);
//         clients.delete(userId);
//         broadcastStatus(userId, false);
//     });
// });

// // Function to broadcast user status to all connected clients
// function broadcastStatus(userId, isOnline) {
//     const message = JSON.stringify({ userId, isOnline });

//     for (const [_, client] of clients) {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(message);
//         }
//     }
// }
