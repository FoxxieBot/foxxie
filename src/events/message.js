const Discord = require('discord.js')
const fs = require('fs')
const ms = require('ms')
const config = require('../../lib/config')
const errormsg = require('../../lib/util/error')
const mongo = require('../../lib/structures/database/mongo')
const messageCountSchema = require('../../lib/structures/database/schemas/server/messageCountSchema')
const serverMessageCountSchema = require('../../lib/structures/database/schemas/server/serverMessageCountSchema')
const disboardBumpSchema = require('../../lib/structures/database/schemas/server/disboard/disboardBumpSchema')
const disboardChannelSchema = require('../../lib/structures/database/schemas/server/disboard/disboardChannelSchema')
module.exports = {
	name: 'message',
	execute: async(message) => {
            
            const client = message.client
            // prevents bot dms
            if (message.channel.type === 'dm') return

    
            if (message.content.toLowerCase() === '!d bump') {
                await mongo().then(async (mongoose) => {
                    try {
                        let guildId = message.guild.id
                        let bump = await disboardBumpSchema.findById({
                            _id: guildId
                        })
                        if (bump !== null) return

                        let disboardchannel = await disboardChannelSchema.findById({
                            _id: guildId
                        })
                        if (disboardchannel === null) return
                        if (message.channel.id !== disboardchannel.disboardChannel) return
                        console.log('bumping owo')

                        client.disboard = require('../store/disboard.json')
                        let remindTime = '20s'
                        let deleteTime = '10s'
    
                await disboardBumpSchema.findByIdAndUpdate({
                    _id: guildId
                }, {
                    _id: guildId,
                    disboardBump: true
                }, {
                    upsert: true
                })
    
                client.disboard [message.guild.id] = {
                    guild: message.guild.id,
                    authID: message.author.id,
                    time: Date.now() + ms(remindTime),
                    channelID: disboardchannel.disboardChannel,
                    displayColor: message.guild.me.displayColor,
                    deleteDbTime: Date.now() + ms(deleteTime)
                }
    
                console.log(`gonna try to write file`)
                
                fs.writeFile('src/store/disboard.json', JSON.stringify(client.disboard, null, 4), err => {
                if (err) console.log(err)
                })
                message.react('✅')
                
            } finally {}
            })
            }

            // mimu pick command
            if (message.guild.id === '761512748898844702' && message.content.toLowerCase() === '.pick') return message.channel.send('**Darlin\'** I\'m flattered you want to pick me but again mimu\'s prefix is \`?\`.')

            // command handler

            var lang;
            var language = 'en'
            if (language 
            ? language = language
            : language = 'en') 
            lang = require(`../../src/languages/${language}`)

            client.commands = new Discord.Collection();

            const commandFolders = fs.readdirSync('./src/commands');
        
            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.name, command);
                }
                }

            if (message.content.startsWith(config.prefix)) {
                if (message.author.bot) return
                const args = message.content.slice(config.prefix.length).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();
                const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
                        if (!command) return;

                    if (command.permissions) {
                        const authorPerms = message.channel.permissionsFor(message.author);
                        if (!authorPerms || !authorPerms.has(command.permissions)) {
                            return errormsg.permError(lang, message, command)
                        }
                    };    

            try {command.execute(lang, message, args, client) 
                console.log(command.name)
            } catch (error) {
                console.error(error);
                return errormsg.codeError(lang, message)
            }
        }

        if (message.content.toLowerCase().startsWith('fox')) {
            if (message.author.bot) return
            const args = message.content.slice(3).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) return
            
            if (command.permissions) {
                const authorPerms = message.channel.permissionsFor(message.author);
                if (!authorPerms || !authorPerms.has(command.permissions)) {
                    return errormsg.permError(lang, message, command)
                }
            };    

            try {command.execute(lang, message, args, client)
            } catch (error) {
                console.error(error);
                return errormsg.codeError(lang, message)
            }
        }

        // Message counter

        let guildID = message.guild.id
        let userID = message.author.id

        await mongo().then(async (mongoose) => {
            try {
                await messageCountSchema.findOneAndUpdate({
                    guildId: guildID,
                    userId: userID
                }, {
                    $inc: {
                        'messageCount': 1
                    } 
                }, {
                    upsert: true
                }).exec()
                await serverMessageCountSchema.findOneAndUpdate({
                    guildId: guildID
                }, {
                    $inc: {
                        'messageCount': 1
                    }
                }, {
                    upsert: true
                }).exec()
            } finally {}
        })
    },
};