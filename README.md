# MDH-MD-
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({ auth: new LocalAuth() });

client.on('qr', (qr) => {
    console.log('Scan this QR code with your WhatsApp to pair the bot:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✓ Bot is ready!');
    console.log('Bot is now connected and listening for messages...');
});

client.on('message', async (message) => {
    const text = message.body.toLowerCase();
    if (text === '!help') {
        message.reply(`*WhatsApp Bot Commands:*
!help - Show this help message
!ping - Responds with pong
!hello - Says hello
!info - Bot information
!time - Get current time
!echo [text] - Repeat your message
!status - Check bot status`);
    }
    if (text === '!ping') {
        message.reply('🏓 Pong!');
    }
    if (text === '!hello') {
        const contact = await message.getContact();
        message.reply(`👋 Hello ${contact.pushname || 'there'}!`);
    }
    if (text === '!info') {
        message.reply(`*Bot Information:*
Name: MrDiehard LOF Bot
Version: 1.0.0
Status: Active ✓`);
    }
    if (text === '!time') {
        const now = new Date();
        message.reply(`🕐 Current time: ${now.toLocaleTimeString()}`);
    }
    if (text.startsWith('!echo ')) {
        const echo = text.replace('!echo ', '');
        message.reply(echo);
    }
    if (text === '!status') {
        message.reply('✓ Bot is online and running!');
    }
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
    process.exit(0);
});

client.initialize();
