const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html'); });

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

let isBrowserReady = false;

client.on('qr', () => {
    console.log('✅ WhatsApp Background Engine Loaded.');
    isBrowserReady = true;
});

io.on('connection', (socket) => {
    socket.on('request-pairing-code', async (phoneNumber) => {
        if (!isBrowserReady) {
            socket.emit('status', '❌ Wait 10s for Server to boot.');
            return;
        }
        try {
            const cleanNumber = phoneNumber.replace(/[^0-9]/g, ''); 
            socket.emit('status', 'Talking to Meta Servers...');
            const code = await client.requestPairingCode(cleanNumber);
            socket.emit('pairing-code-received', code);
            socket.emit('status', 'Enter this code in WhatsApp!');
        } catch (error) {
            socket.emit('status', '❌ Failed. Try Again.');
        }
    });
});

client.on('ready', () => {
    console.log('🔥 MDH BOT IS ONLINE!');
    io.emit('ready', '🔥 SYSTEM ONLINE. ACCOUNT LINKED.');
});

client.on('message', async message => {
    if (message.body.toLowerCase() === '.ping') {
        await message.reply('*MDH BOT:* PONG! 🏓');
    }
});

client.initialize();
server.listen(3000, () => {
    console.log('🚀 SERVER STARTING... Wait 15s then click Open in Browser!');
});
