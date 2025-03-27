require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

if (!process.env.DISCORD_TOKEN) {
    console.error('Error: Discord token not found! Make sure to configure the .env file');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

const reactionKeywords = [
    'reaja', 'react', 'reaccione', 'réagissez', 
    'reagieren', 'reageer', 'reage', 'reagir'
];

client.once(Events.ClientReady, () => {
    console.log(`Bot started as ${client.user.tag}`);
    console.log('Waiting for messages that need reaction...');
});

client.on(Events.MessageCreate, async (message) => {
    try {
        if (message.author.bot && message.author.id === client.user.id) return;
        
        if (message.embeds.length > 0) { 
            for (const embed of message.embeds) {
                if (!embed || !embed.description) continue;
                
                const description = embed.description.toLowerCase();
                
                const shouldReact = reactionKeywords.some(keyword => 
                    description.includes(keyword)
                );
                
                if (shouldReact) {
                    await message.react('❤️');
                    console.log(`Reaction added: ${message.guild?.name || 'DM'} | ${message.channel.name || 'channel'}`);
                    break;
                }
            }
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

client.on(Events.Error, (error) => {
    console.error('Discord client error:', error);
});

client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Connected to Discord'))
    .catch((error) => {
        console.error('Failed to connect to Discord:', error);
        process.exit(1);
    });

process.on('SIGINT', () => {
    console.log('Disconnecting bot...');
    client.destroy();
    process.exit(0);
});
