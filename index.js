const path = require("path"); 
const fs = require("fs");
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ActivityType } = require('discord.js');
const keepAlive = require(`./server`);
// const express = require('express');
// const app = express();
// tracker branch


require('dotenv').config();  // Load environment variables
const readline = require('readline');



const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    const channel = client.channels.cache.get('1361031045004398718'); // Replace with your channel ID
    if (channel) {
        const embed = new EmbedBuilder()
            .setColor(0x99e4ff) // Green color
            .setTitle('Bot Online')
            .setDescription('The bot is running!')
            .setTimestamp()
            .setFooter({ text: 'Bot Status', iconURL: client.user.displayAvatarURL() });

        channel.send({ embeds: [embed] });
    } else {
        console.error('Channel not found for startup message.');
    }

    loadTodoLists(); // Load saved to-do lists on bot startup
    scheduleDailyUpdate();


    client.user.setPresence({
        activities: [{ name: "with Zawad", type: ActivityType.LISTENING }],
        status: 'online' // Other options: 'idle', 'dnd', 'invisible'

    });
    
    updateVoiceChannelNames();

    // Check for ongoing calls in duration.json
    for (const channelId in ongoingCalls) {
        const callData = ongoingCalls[channelId];

        // If the call has not ended, resume tracking it
        if (!callData.isEnded) {
            activeCalls[channelId] = true;
            callStartTimes[channelId] = callData.startTime;

            console.log(`Resumed tracking call in channel ${channelId} (started at ${new Date(callData.startTime).toLocaleString()})`);
        }
    }
});


client.on('messageCreate', async (message) => {
    if (message.content === '!shutdown') {
        if (message.author.id !== '359616511561826305') { // Replace with your Discord user ID
            return message.reply("You are not daddy.");
        }

        const channel = client.channels.cache.get('1361031045004398718'); // Replace with your channel ID
        if (channel) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000) // Red color
                .setTitle('Shutting Down')
                .setDescription('The bot is shutting down as requested.')
                .setTimestamp()
                .setFooter({ text: 'Bot Status', iconURL: client.user.displayAvatarURL() });

            await channel.send({ embeds: [embed] });
        }

        console.log('Bot is shutting down...');
        process.exit(0); // Exit the process
    }
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);

    const channel = client.channels.cache.get('1361031045004398718'); // Replace with your channel ID
    if (channel) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000) // Red color
            .setTitle('Bot Crashed')
            .setDescription('The bot has encountered an error and crashed.')
            .addFields({ name: 'Error', value: `\`\`\`${error.message}\`\`\`` })
            .setTimestamp()
            .setFooter({ text: 'Bot Status', iconURL: client.user.displayAvatarURL() });

        channel.send({ embeds: [embed] }).catch(console.error);
    }

    process.exit(1); // Exit the process
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);

    const channel = client.channels.cache.get('1361031045004398718'); // Replace with your channel ID
    if (channel) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000) // Red color
            .setTitle('Bot Crashed')
            .setDescription('The bot has encountered an unhandled promise rejection and crashed.')
            .addFields({ name: 'Reason', value: `\`\`\`${reason}\`\`\`` })
            .setTimestamp()
            .setFooter({ text: 'Bot Status', iconURL: client.user.displayAvatarURL() });

        channel.send({ embeds: [embed] }).catch(console.error);
    }

    process.exit(1); // Exit the process
});

process.on('SIGINT', async () => {
    console.log('Bot is shutting down due to SIGINT (CTRL+C)...');

    const channel = client.channels.cache.get('1361031045004398718'); // Replace with your channel ID
    if (channel) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000) // Red color
            .setTitle('Shutting Down')
            .setDescription('The bot is shutting down due to a manual termination.')
            .setTimestamp()
            .setFooter({ text: 'Bot Status', iconURL: client.user.displayAvatarURL() });

        try {
            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to send shutdown message:', error);
        }
    } else {
        console.error('Channel not found for shutdown message.');
    }

    process.exit(0); // Exit the process
});

client.on('messageCreate', (message) => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

client.on('messageCreate', (message) => {
    if (message.content === '!ntimetable') {
        message.channel.send('https://media.discordapp.net/attachments/1345359086593507341/1349618840560074763/image.png?ex=67d3c1fe&is=67d2707e&hm=b7415e3e79c89c14f2a7e64397a6c6f241205c66cf48e92ac0f3ce1db3b3a4f8&=&format=webp&quality=lossless');
    }
});

client.on('messageCreate', (message) => {
    if (message.content === '!ztimetable') {
        message.channel.send('https://media.discordapp.net/attachments/1345359086593507341/1346085487269515326/VDGgNVF70inBvx72egUr-1.png?ex=67c6e74d&is=67c595cd&hm=6ae6df738782c629ae3641b98ef2ce8e440ce6c3f8dd732386be2233c4218189&=&format=webp&quality=lossless&width=738&height=757');
    }
});

client.on('messageCreate', (message) => {
    if (message.content === '!zawad') {
        message.channel.send('I love Nancy!');
    }
});

client.on('messageCreate', (message) => {       
    if (message.content === '!nancy') {
        message.channel.send('I love Zawad!')
    }
})

client.on('messageCreate', (message) => {
    if (message.content === '!embed') {
        const embed = new EmbedBuilder()
            .setColor(0xedb0ff) // Blue color
            .setTitle('I Love Nancy!')
        .setDescription("thank you Nancy for being my girlfriend. i didn't think you would play such a big part in my life, but here we are i guess. Thank for making every day brighter. thank you for being so cute, pretty, such a cute voice, and having such a bright personality and truly just being perfect in every way. you truly can't stop making me happy, and certainly can't stop having amazing days if you are there. you are the best my pookie!! i love everything you to do and im seriously just addicted to you. i love playing valorant with you and i love spending time with you!! i love hearing your voice and i love seeing you just being so cute. every time i see you every day irl i am just filled with joy from your presence, you truly make me SO happy. i hope we can spend a lot more time on this world together, and we are never breaking up because you are stuck with me whether you like it or not. I LOVE U NANU!!!")
        .setImage(`https://cdn.discordapp.com/attachments/1345360596828426280/1364528661688221777/kiss-kitty-mwah-kitty-ezgif.com-video-to-gif-converter.gif?ex=6809ffd8&is=6808ae58&hm=1da0ad30fdc61b02b892fc252a3d0a2d8d78978fdb85a0516e90ecda8449851f&`)
            .setTimestamp()
            .setFooter({ text: 'nancy <3', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
});

// Function to create and send a welcome embed
function sendWelcomeEmbed(member) {
    const welcomeEmbed = new EmbedBuilder()
        .setColor(0xffd3d3)
        .setAuthor({ name: '⌢⌢⌢⌢⌢⌢꒰ ♡ ꒱⌢⌢⌢⌢⌢⌢', iconURL: member.user.displayAvatarURL() })
        .setDescription(`### **wlc 2 our home ♡** *!*`)
        .addFields(
            { name: '', value: '`🍰`・https://discord.com/channels/1345359085696188431/1345359086593507341 for **chatsies** ☆\n`🎀`・https://discord.com/channels/1345359085696188431/1345362097953050684 for __our__ gallery **୨୧**\n`🍵`・https://discord.com/channels/1345359085696188431/1345359682969145384 for da  **fweaky** :3' }
        )
        .setThumbnail(`https://cdn.discordapp.com/attachments/1345360596828426280/1348237291008823336/cut.gif?ex=67cebb53&is=67cd69d3&hm=df0f4965ec1359e80ad4546a3dd07f5ef480f89180fc06a45cd849891abd958f&`)
        .setTimestamp()
        .setImage(`https://cdn.discordapp.com/attachments/1141987769393094717/1336841900468211742/IMG_5820.gif?ex=67ce250a&is=67ccd38a&hm=8c38e8954d8c3cf6b921da625a8ab0149e81f6a05135a07129769b3d52ec832b&`)
        .setFooter({ text: '⟡ enjoy your eternal stay . . ' });

    const systemChannel = member.guild.systemChannel;
    if (systemChannel) {
        systemChannel.send({ content: `♡⸝⸝ <@${member.user.id}> . . .`, embeds: [welcomeEmbed] }).catch(error => {
            console.error('Could not send welcome message:', error);
        });
    } else {
        console.error('System channel not found.');
    }
}

// Welcome new members
client.on('guildMemberAdd', (member) => {
    const systemChannel = member.guild.systemChannel;
    if (systemChannel) {
        sendWelcomeEmbed(member, systemChannel);
    } else {
        console.error('System channel not found.');
    }
});

// Example command to manually send a welcome message in the current channel
client.on('messageCreate', (message) => {
    if (message.content === '!welcome') {
        sendWelcomeEmbed(message.member, message.channel);
    }
});

// Purge chat
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!purge')) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply("You don't have permission to use this command.");
        }

        const args = message.content.split(' ');
        const amount = parseInt(args[1])+1;

        if (isNaN(amount) || amount <= 0 || amount > 1000) {
            return message.reply('Please provide a number between 1 and 1000.');
        }

        try {
            await message.channel.bulkDelete(amount, true);
            message.channel.send(`Successfully deleted ${amount-1} messages.`).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        } catch (error) {
            console.error('Error deleting messages:', error);
            message.reply('There was an error trying to delete messages in this channel!');
        }
    }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const channel = client.channels.cache.get('1345359086593507341');  // Replace with your channel ID
    if (channel) {
        channel.send(input);
        console.log(`Sent: ${input}`);  // Log the sent message
    } else {
        console.log('Channel not found.');
    }
});

// !help command
client.on('messageCreate', (message) => {
    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setColor(0xffc2c2)
            .setTitle('📜 Available Commands')
            .setDescription('Here are all the commands you can use:')
            .addFields(
                { name: '・!help', value: '୨୧ List all the commands available for you.' },
            )
            .setTimestamp()
            .setImage(`https://imgur.com/q2YQXz6`)
            .setFooter({ text: '<3 Nancy', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [helpEmbed] });

        const helpEmbed2 = new EmbedBuilder()
            .setColor(0xfff3c7)
            .setTitle('📞 Call Commands')
            .setDescription('Commands regarding calls:')
            .addFields(
                { name: '・ !timer [time in hours]', value: '୨୧ Set a sleep timer for the bot to disconnect all users from the voice channel after the specified time in hours.' },
                { name: '・ !duration', value: '୨୧ Check the duration of the current call you are in.' },
                { name: '・ !topcalls', value: '୨୧ Display the top 10 longest calls in the server.' },
            )
            .setTimestamp()
            .setImage(`https://imgur.com/q2YQXz6`)
            .setFooter({ text: '<3 Nancy', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [helpEmbed2] });

        const helpEmbed3 = new EmbedBuilder()
            .setColor(0xc2ffd2)
            .setTitle('📝 Todolist')
            .setDescription('Commands to operate the todolist:')
            .addFields(
                { name: '・ !todo [item] [item2]', value: '୨୧ Add items to your todolist' },
                { name: '・ !todo view', value: '୨୧ View your current Todo list.' }
            )
            .setTimestamp()
            .setImage(`https://imgur.com/q2YQXz6`)
            .setFooter({ text: '<3 Nancy', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [helpEmbed3] });

        const helpEmbed4 = new EmbedBuilder()
        .setColor(0xc7e5ff)
        .setTitle('⏱ Tracker Commands')
        .setDescription('Commands to operate the tracker:')
        .addFields(
            { name: '・ !t start [task name]', value: '୨୧ Starts the tracker'},
            { name: '・ !t end', value: '୨୧ Ends the tracker'},
            { name: '・ !t duration', value: '୨୧ Check the duration of your tracker'},
            { name: '・ !t today', value: "୨୧ Check today's stats"},
            { name: '・ !t week', value: "୨୧ Starts this week's stats"},
            { name: '・ !t month', value: "୨୧ Starts this month's stats"},
        )
        .setTimestamp()
        .setImage(`https://imgur.com/q2YQXz6`)
        .setFooter({ text: '<3 Nancy', iconURL: message.author.displayAvatarURL() });

    message.channel.send({ embeds: [helpEmbed4] });

        const helpEmbed5 = new EmbedBuilder()
            .setColor(0xe3c7ff)
            .setTitle('🔨 Moderation Commands:')
            .setDescription('Commands to moderate the server:')
            .addFields(
                { name: '・ !shutdown', value: '୨୧ Manually shutdown the bot'},
                { name: '・ !purge [1-1000]', value: '୨୧ Remove amount of message defined by command parameters' },
            )
            .setTimestamp()
            .setImage(`https://imgur.com/q2YQXz6`)
            .setFooter({ text: '<3 Nancy', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [helpEmbed5] });

        const helpEmbed6 = new EmbedBuilder()
            .setColor(0xffc7f0)
            .setTitle('🎀 Misc commmands:')
            .setDescription('All the misc cutie patootie commands ❤:')
            .addFields(
                { name: '・ !ntimetable', value: "୨୧ Display Nancy's timetable" },
                { name: '・ !ztimetable', value: "୨୧ Display Zawad's timetable" },
                { name: '・ !zawad', value: '୨୧ A very honest message quoting the greatest Zawad himself' },
                { name: '・ !nancy', value: '୨୧ A cute message quoting the princess Nancy herself' },
            )
            .setTimestamp()
            .setImage(`https://imgur.com/q2YQXz6`)
            .setFooter({ text: '<3 Nancy', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [helpEmbed6] });
    }
});

let activeTimers = {};  // To track active timers for each voice channel
let activeTimerMessages = {}; // To track the message reference for the countdown timer

// Sleep Timer
client.on('messageCreate', (message) => {
    if (message.content.startsWith('!timer')) {
        const args = message.content.split(' ');
        const hours = parseInt(args[1]);

        // Check if the user is in a voice channel
        if (!message.member.voice.channel) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xc74646)
                .setTitle('Error')
                .setDescription('You need to be in a voice channel to use this command!')
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });
            return message.channel.send({ embeds: [errorEmbed] });
        }

        const voiceChannel = message.member.voice.channel;

        // Check if user wants to stop the timer by typing !timer 0
        if (hours === 0) {
            if (activeTimers[voiceChannel.id]) {
                clearTimeout(activeTimers[voiceChannel.id].timer); // Stop the timer
                clearInterval(activeTimers[voiceChannel.id].interval); // Stop the periodic updates
                delete activeTimers[voiceChannel.id];  // Remove from active timers
                delete activeTimerMessages[voiceChannel.id];  // Remove message reference

                const stopEmbed = new EmbedBuilder()
                    .setColor(0xc74646)
                    .setTitle('Timer Stopped')
                    .setDescription(`The timer for **${voiceChannel.name}** has been stopped.`)
                    .setTimestamp()
                    .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [stopEmbed] });
            } else {
                const noTimerEmbed = new EmbedBuilder()
                    .setColor(0xc74646)
                    .setTitle('No Active Timer')
                    .setDescription(`There is no active timer for **${voiceChannel.name}**.`)
                    .setTimestamp()
                    .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [noTimerEmbed] });
            }
        }

        // Validate if the time provided is a valid number of hours
        if (isNaN(hours) || hours <= 0) {
            const invalidTimeEmbed = new EmbedBuilder()
                .setColor(0xc74646)
                .setTitle('Invalid Time')
                .setDescription('Please provide a valid number of hours.')
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });
            return message.channel.send({ embeds: [invalidTimeEmbed] });
        }

        // Calculate the time in milliseconds
        const timeInMs = hours * 60 * 60 * 1000;

        // Store the timer for this voice channel
        activeTimers[voiceChannel.id] = {
            remainingTime: timeInMs,  // Store the total remaining time
            timer: setTimeout(() => {
                // When the timer finishes, disconnect all users from the voice channel
                voiceChannel.members.forEach(member => {
                    member.voice.disconnect();
                });

                const endEmbed = new EmbedBuilder()
                    .setColor(0xc74646)  // Red color for disconnect event
                    .setTitle('Voice Channel Timeout')
                    .setDescription(`The timer for **${voiceChannel.name}** has ended, and all users have been disconnected.`)
                    .addFields(
                        { name: 'Duration', value: `${hours} hour(s)`, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

                // Send the embed to a text channel
                const textChannel = message.guild.channels.cache.get('1345360596828426280');
                if (textChannel) {
                    textChannel.send({ embeds: [endEmbed] });
                }

                // Remove the timer from the activeTimers object
                delete activeTimers[voiceChannel.id];
                delete activeTimerMessages[voiceChannel.id]; // Remove the message reference
            }, timeInMs),
            interval: setInterval(() => {
                // Update remaining time every second and show in an embed
                const remainingHours = Math.floor(activeTimers[voiceChannel.id].remainingTime / (1000 * 60 * 60));
                const remainingMinutes = Math.floor((activeTimers[voiceChannel.id].remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const remainingSeconds = Math.floor((activeTimers[voiceChannel.id].remainingTime % (1000 * 60)) / 1000);

                const updateEmbed = new EmbedBuilder()
                    .setColor(0x99e4ff)  // Blue color for timer updates
                    .setTitle('Timer Update')
                    .setDescription(`Time remaining for **${voiceChannel.name}**:`)
                    .addFields(
                        { name: 'Remaining Time', value: `${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

                // If we have the message reference, edit the existing message
                const textChannel = message.guild.channels.cache.get('1345360596828426280');
                if (textChannel && activeTimerMessages[voiceChannel.id]) {
                    activeTimerMessages[voiceChannel.id].edit({ embeds: [updateEmbed] });
                }

                // Decrease the remaining time by 1 second
                activeTimers[voiceChannel.id].remainingTime -= 1000;
                if (activeTimers[voiceChannel.id].remainingTime <= 0) {
                    clearInterval(activeTimers[voiceChannel.id].interval); // Stop updating once the timer is finished
                }
            }, 1000)  // Update every second
        };

        // Send the initial embed to the text channel and store the message reference
        const startEmbed = new EmbedBuilder()
            .setColor(0x99e4ff)
            .setTitle('Timer Started')
            .setDescription(`A **${hours} hour(s)** timer has been set for **${voiceChannel.name}**. After this time, all users will be disconnected.`)
            .setTimestamp()
            .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

        const textChannel = message.guild.channels.cache.get('1345360596828426280');
        if (textChannel) {
            textChannel.send({ embeds: [startEmbed] }).then(sentMessage => {
                activeTimerMessages[voiceChannel.id] = sentMessage;  // Store the message reference
            });
        }
    }
});

// Call Duration

let callStartTimes = {};  // To track call start times by channel ID
let activeCalls = {};  // To track if a call is active in a channel

client.on('voiceStateUpdate', (oldState, newState) => {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    // Handle when a user joins a voice channel
    if (!oldChannel && newChannel) {
        const channelId = newChannel.id;

        // If the call is already ongoing, do not reset the timer
        if (ongoingCalls[channelId] && !ongoingCalls[channelId].isEnded) {
            return;
        }

        if (!activeCalls[channelId]) {
            const embed = new EmbedBuilder()
                .setColor(0x6ed493)
                .setTitle('▶ Call Started')
                .setDescription(`A call has started in **${newChannel.name}** 🎤`)
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: client.user.displayAvatarURL() });

            const textChannel = newState.guild.channels.cache.get('1345385715491536927');
            if (textChannel) {
                textChannel.send({ embeds: [embed] });
            }

            activeCalls[channelId] = true;
            callStartTimes[channelId] = Date.now(); // Store start time

            // Save start time to duration.json
            ongoingCalls[channelId] = {
                startTime: Date.now(),
                endTime: null,
                isEnded: false,
            };
            saveOngoingCalls();
        }
    }

    // Handle when a user leaves a voice channel
    if (oldChannel && !newChannel) {
        const channelId = oldChannel.id;

        // If the channel still has members, do not stop the timer
        if (oldChannel.members.size > 0) {
            return;
        }

        if (activeCalls[channelId]) {
            const callData = ongoingCalls[channelId];
            const callDuration = Date.now() - callData.startTime;
            const durationHours = Math.floor(callDuration / 3600000);
            const durationMinutes = Math.floor((callDuration % 3600000) / 60000);
            const durationSeconds = Math.floor((callDuration % 60000) / 1000);

            const embed = new EmbedBuilder()
                .setColor(0xc74646)
                .setTitle('⏹ Call Ended')
                .setDescription(`The call in **${oldChannel.name}** has ended! 🎤`)
                .addFields(
                    { name: 'Call Duration', value: `${durationHours}h ${durationMinutes}m ${durationSeconds}s`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: client.user.displayAvatarURL() });

            const textChannel = oldState.guild.channels.cache.get('1345385715491536927');
            if (textChannel) {
                textChannel.send({ embeds: [embed] });
            }

            // Save the end time and mark the call as ended in duration.json
            ongoingCalls[channelId].endTime = Date.now();
            ongoingCalls[channelId].isEnded = true;
            saveOngoingCalls();

            // Update stats
            stats.totalCallDuration += callDuration;
            stats.totalCalls += 1;
            saveStats();

            // Remove the completed call from duration.json
            delete ongoingCalls[channelId];
            saveOngoingCalls();

            delete activeCalls[channelId];
            delete callStartTimes[channelId];
        }
    }
});

// Command to Check Call Duration
client.on('messageCreate', (message) => {
    if (message.content === '!duration') {
        if (!message.member.voice.channel) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xc74646)
                .setTitle('Error')
                .setDescription('You need to be in a voice channel to check the call duration!')
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

            return message.channel.send({ embeds: [errorEmbed] });
        }

        const voiceChannel = message.member.voice.channel;
        const channelId = voiceChannel.id;

        if (!ongoingCalls[channelId] || ongoingCalls[channelId].isEnded) {
            const noCallEmbed = new EmbedBuilder()
                .setColor(0xc74646)
                .setTitle('No Active Call')
                .setDescription(`There is no active call in **${voiceChannel.name}**.`)
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

            return message.channel.send({ embeds: [noCallEmbed] });
        }

        const callStartTime = ongoingCalls[channelId].startTime;
        const callDuration = Date.now() - callStartTime;

        // Convert time to hours, minutes, and seconds
        const hours = Math.floor(callDuration / 3600000);
        const minutes = Math.floor((callDuration % 3600000) / 60000);
        const seconds = Math.floor((callDuration % 60000) / 1000);

        // Format duration string
        let durationString = '';
        if (hours > 0) durationString += `${hours}h `;
        if (minutes > 0 || hours > 0) durationString += `${minutes}m `;
        durationString += `${seconds}s`;

        const durationEmbed = new EmbedBuilder()
            .setColor(0x99e4ff)
            .setTitle('⏲ Call Duration')
            .setDescription(`The call in **${voiceChannel.name}** has been active for:`)
            .addFields(
                { name: 'Duration', value: durationString, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [durationEmbed] });
    }
});

const TODO_FILE = path.join(__dirname, "todolist.json");

let todoLists = {}; // Store all user to-do lists

// Load to-do lists from file
function loadTodoLists() {
    try {
        const data = fs.readFileSync(TODO_FILE, "utf-8");
        todoLists = JSON.parse(data);
    } catch (err) {
        todoLists = {};
    }
}

// Save to-do lists to file
function saveTodoLists() {
    fs.writeFileSync(TODO_FILE, JSON.stringify(todoLists, null, 2));
}


const CALLS_DB_FILE = path.join(__dirname, "calls.json");

let callDurations = []; // Store all call durations

// Load call durations from file
function loadCallDurations() {
    try {
        const data = fs.readFileSync(CALLS_DB_FILE, "utf-8");
        callDurations = JSON.parse(data);
    } catch (err) {
        callDurations = [];
    }
}

// Save call durations to file
function saveCallDurations() {
    fs.writeFileSync(CALLS_DB_FILE, JSON.stringify(callDurations, null, 2));
}

// Load call durations on bot startup
loadCallDurations();

const STATS_FILE = path.join(__dirname, "stats.json");

let stats = {
    totalCallDuration: 0,
    totalCalls: 0,
    averageDuration: 0
};

// Load stats from file
function loadStats() {
    try {
        const data = fs.readFileSync(STATS_FILE, "utf-8");
        stats = JSON.parse(data);
    } catch (err) {
        stats = {
            totalCallDuration: 0,
            totalCalls: 0,
            averageDuration: 0
        };
    }
}

// Save stats to file
function saveStats() {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

// Load stats on bot startup
loadStats();

const DURATION_FILE = path.join(__dirname, "duration.json");

let ongoingCalls = {}; // Store ongoing call data

// Load ongoing calls from file
function loadOngoingCalls() {
    try {
        const data = fs.readFileSync(DURATION_FILE, "utf-8");
        ongoingCalls = JSON.parse(data);
    } catch (err) {
        ongoingCalls = {};
    }
}

// Save ongoing calls to file
function saveOngoingCalls() {
    fs.writeFileSync(DURATION_FILE, JSON.stringify(ongoingCalls, null, 2));
}

// Load ongoing calls on bot startup
loadOngoingCalls();

// Command handler
client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("!todo")) return;

    const args = message.content.match(/\[(.*?)\]/g);
    const userId = message.author.id;

    // Handle the case when no arguments are passed
    if (!args) {
        // Check if the command is to view the todo list
        if (message.content === "!todo view") {
            if (!todoLists[userId] || todoLists[userId].tasks.length === 0) {
                return message.channel.send({ embeds: [new EmbedBuilder().setColor(0xc74646).setTitle("Your Todo List is Empty!")] });
            }
            return sendTodoList(message, userId);
        }
        return;
    }

    // Extract tasks from the brackets
    const tasks = args.map((task) => task.replace(/\[|\]/g, ""));

    // If the user doesn't have a to-do list, create one
    if (!todoLists[userId]) {
        todoLists[userId] = { creatorId: userId, tasks: [] };
    }

    // Update the user's to-do list with new tasks
    todoLists[userId].tasks = tasks.map((task) => ({ text: task, checked: false }));

    // Save the updated to-do list to the JSON file
    saveTodoLists();

    return sendTodoList(message, userId);
});

// Interaction handler for selecting tasks to check off
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    const userId = interaction.user.id;
    const selectedIndex = parseInt(interaction.values[0]);

    // Ensure that the user has a to-do list
    if (!todoLists[userId]) {
        return interaction.reply({ content: "You don't have a to-do list yet.", ephemeral: true });
    }

    // Prevent the user from interacting with another user's to-do list
    const creatorId = todoLists[userId].creatorId;

    // If the to-do list was created by someone else, prevent interaction
    if (creatorId !== userId) {
        return interaction.reply({ content: "You can't modify someone else's to-do list!", ephemeral: true });
    }

    // Ensure the selected index is within range
    if (selectedIndex < 0 || selectedIndex >= todoLists[userId].tasks.length) {
        return interaction.reply({ content: "Invalid task selection.", ephemeral: true });
    }

    // Toggle task completion
    todoLists[userId].tasks[selectedIndex].checked = !todoLists[userId].tasks[selectedIndex].checked;

    // Save updated to-do lists
    saveTodoLists();

    // Update the message with the updated to-do list
    await interaction.update({
        embeds: [generateTodoEmbed(userId)],
        components: [generateTodoDropdown(userId)],
    }).catch(error => {
        console.error('Error updating interaction:', error);
        interaction.reply({ content: 'There was an error updating your to-do list.', ephemeral: true });
    });
});

// Send the user's to-do list with dropdown
function sendTodoList(message, userId) {
    return message.channel.send({
        embeds: [generateTodoEmbed(userId)],
        components: [generateTodoDropdown(userId)],
    });
}

// Generate embed for the to-do list
function generateTodoEmbed(userId) {
    const list = todoLists[userId].tasks
        .map((task, index) => `${task.checked ? "✅" : "❌"} **${index + 1}.** ${task.checked ? `~~${task.text}~~` : task.text}`)
        .join("\n");

    return new EmbedBuilder()
        .setColor(0xbccda6)
        .setTitle("Your Todo List")
        .setDescription(list || "No tasks available.")
        .setFooter({ text: "Use the dropdown below to check off items!" });
}

// Generate dropdown menu for the to-do list
function generateTodoDropdown(userId) {
    const menu = new StringSelectMenuBuilder()
        .setCustomId("todo_select")
        .setPlaceholder("Select a task to mark as done")
        .addOptions(
            todoLists[userId].tasks.map((task, index) => ({
                label: task.text,
                value: index.toString(),
                description: task.checked ? "Checked" : "Unchecked",
            }))
        );

    return new ActionRowBuilder().addComponents(menu);
}

client.on('messageCreate', (message) => {
    if (message.content === '!topcalls') {
        // Sort call durations by duration in descending order and get the top 10
        const topCalls = callDurations.sort((a, b) => b.duration - a.duration).slice(0, 10);

        // Create an embed to display the top 10 longest calls
        const embed = new EmbedBuilder()
            .setColor(0xdbeaff)
            .setTitle('Top 10 Longest Calls')
            .setDescription('Here are the top 10 longest calls:')
            .setTimestamp()
            .setFooter({ text: 'Call Leaderboard', iconURL: message.author.displayAvatarURL() });

        topCalls.forEach((call, index) => {
            const durationHours = Math.floor(call.duration / 3600000);
            const durationMinutes = Math.floor((call.duration % 3600000) / 60000);
            const durationSeconds = Math.floor((call.duration % 60000) / 1000);
            const durationString = `**${durationHours}h ${durationMinutes}m ${durationSeconds}s**`;

            embed.addFields({ name: `#${index + 1}`, value: `Duration: ${durationString}`, inline: false });
        });

        message.channel.send({ embeds: [embed] });
    }
});

client.on('messageCreate', (message) => {
    if (message.content === '!stats') {
        loadStats();
        const totalDurationHours = Math.floor(stats.totalCallDuration / 3600000);
        const totalDurationMinutes = Math.floor((stats.totalCallDuration % 3600000) / 60000);
        const totalDurationSeconds = Math.floor((stats.totalCallDuration % 60000) / 1000);

        const AverageHours = Math.floor(calculateAverageCallDuration() / 3600000);
        const AverageMinutes = Math.floor((calculateAverageCallDuration() % 3600000) / 60000);
        const AverageSeconds = Math.floor((calculateAverageCallDuration() % 60000) / 1000);

        const statsEmbed = new EmbedBuilder()
            .setColor(0xffeea9)
            .setTitle('📋 Call Stats')
            .setDescription('♡⸝⸝ Here are the total call stats:')
            .addFields(
                { name: 'Total Call Duration', value: `${totalDurationHours}h ${totalDurationMinutes}m ${totalDurationSeconds}s`, inline: true },
                { name: 'Total Number of Calls', value: `${stats.totalCalls}`, inline: true },
            )
            .addFields(
                { name: 'Average Call Duration', value: `${AverageHours}h ${AverageMinutes}m ${AverageSeconds}s`, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Call Stats', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [statsEmbed] });
    }
});

function calculateAverageCallDuration() {
    if (stats.totalCalls === 0) return 0;
    return stats.totalCallDuration / stats.totalCalls;
}

// Date Voice Channel update
const TARGET_DATE = new Date('2025-01-17'); // Reference date

// Function to calculate the difference in years, months, and days since the target date
function calculateTimeSinceTarget() {
    const today = new Date();
    const targetDate = new Date(TARGET_DATE);

    let years = today.getFullYear() - targetDate.getFullYear();
    let months = today.getMonth() - targetDate.getMonth();
    let days = today.getDate() - targetDate.getDate();

    // Adjust for negative days
    if (days < 0) {
        months -= 1;
        const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of the previous month
        days += previousMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
}

// Function to update the voice channel names
async function updateVoiceChannelNames() {
    const guild = client.guilds.cache.get('1345359085696188431'); // Replace with your server's ID
    const yearChannel = guild.channels.cache.get('1360437249891893248'); // Replace with your year channel's ID
    const monthChannel = guild.channels.cache.get('1360440741167628380'); // Replace with your month channel's ID
    const dayChannel = guild.channels.cache.get('1360440757000863945'); // Replace with your day channel's ID

    if (!guild || !yearChannel || !monthChannel || !dayChannel) {
        console.error('Guild or one of the channels not found.');
        return;
    }

    const { years, months, days } = calculateTimeSinceTarget();

    try {
        await yearChannel.setName(`・${years} Years`);
        console.log(`Updated year channel name to: Years: ${years}`);

        await monthChannel.setName(`・${months} Months`);
        console.log(`Updated month channel name to: Months: ${months}`);

        await dayChannel.setName(`・${days} Days`);
        console.log(`Updated day channel name to: Days: ${days}`);
    } catch (error) {
        console.error('Failed to update channel names:', error);
    }
}

// Function to calculate the delay until the next 12:00 AM
function calculateDelayUntilMidnight() {
    const now = new Date();
    const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // Move to the next day
        0, 0, 0, 0 // Set time to 12:00 AM
    );
    return nextMidnight - now; // Difference in milliseconds
}

// Schedule the function to update at 12:00 AM daily
function scheduleDailyUpdate() {
    const delay = calculateDelayUntilMidnight();

    setTimeout(() => {
        updateVoiceChannelNames(); // Run the update function at midnight
        setInterval(updateVoiceChannelNames, 24 * 60 * 60 * 1000); // Schedule updates every 24 hours
    }, delay);

    console.log(`Scheduled the first update in ${Math.round(delay / 1000 / 60)} minutes.`);
}

client.login(process.env.TOKEN);

keepAlive();

// app.get('/', (req, res) => {
//     console.log(`Received request from: ${req.headers.host}`);
//     res.send('Bot is running!');
// });

// app.listen(3000, () => {
//     console.log('Web server started');
// });