const { roleplayCommand } = require('../../../lib/structures/roleplayCommands')
module.exports = {
    name: 'blush',
    aliases: ['happy', 'smile'],
    usage: `fox blush [user] (reason)`,
    category: 'fun',
    execute(lang, message, args) {
        
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
    
        let text = args.slice(1).join(' ');

        let command = 'blush';
        let actionText = 'blushes at';

        roleplayCommand(message, command, mentionMember, text, actionText)
    }
}