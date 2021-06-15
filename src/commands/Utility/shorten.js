const { Command } = require('foxxie');
const { shorten, custom } = require('isgd');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'shorten',
            aliases: ['sl', 'tiny'],
            usage: '[Link] (Name)',
            category: 'utility'
        })
    }

    async run(msg, args) {

        if (!args[0]) return msg.responder.error('COMMAND_SHORTEN_NOARGS');

        if (!args[1]) shorten(args[0], res => {
            return msg.responder.success('COMMAND_SHORTEN_SUCCESS', res);
        });

        let name = args[1].replace(/[^a-zA-Z0-9_]\s*/ugi, '_');
    
        custom(args[0], name, res => {
            if (res.startsWith('Error')) return msg.responder.error('COMMAND_SHORTEN_ERROR', name);
            return msg.responder.success('COMMAND_SHORTEN_SUCCESS_NAME', args[1], res);
        });
    }
}