const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const webhookRouter = require('./routes/webhook');
const DialogflowService = require('./services/dialogflowService');
const uuid = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Dialogflow Config
const DIALOGFLOW_PROJECT_ID = process.env.PROJECT_ID;
const dialogflow = new DialogflowService(
    DIALOGFLOW_PROJECT_ID,
    process.env.JSON_FILE_PATH
);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/webhook', webhookRouter);

// WebSocket
io.on('connection', (socket) => {
    console.log("New client connected");
    const sessionId = uuid.v4();

    socket.on('message', async (text) => {
        try {
            console.log("text", text)
            const result = await dialogflow.detectIntent(sessionId, text);
            socket.emit('message', result);
        } catch (error) {
            socket.emit('error', 'Failed to process message');
        }
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected");
    });
});

app.get("/", (req, res) => res.send("Hello World!"));

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));