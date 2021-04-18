const { roleplayCommand } = require('../../../lib/structures/roleplayCommands')
module.exports = {
    name: 'tease',
    usage: `fox tease [user] (reason)`,
    category: 'fun',
    execute(lang, message, args) {
        
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
    
        let text = args.slice(1).join(' ');

        let command = 'tease';
        let actionText = 'is teasing';

        roleplayCommand(message, command, mentionMember, text, actionText)
    }
}