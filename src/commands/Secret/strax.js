const { emojis: { secretCommands: { strax } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'strax',
    aliases: ['straxy'],
    category: 'secret',
    execute({ message }) {

        message.delete();
        message.channel.send(strax)
    }
}