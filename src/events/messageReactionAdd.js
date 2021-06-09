const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'messageReactionAdd',
        })
    }

    run(reaction, user) {

        if (!reaction.message.guild) return null;

        this.client.monitors.get('rero').execute(reaction, user, 'add');

        this.stars(reaction, user);
    }

    async stars(reaction, user) {

        if (reaction.message.partial) {
            await reaction.fetch();
            await reaction.message.fetch();
        }

        const { bot } = user;
        if (bot) return false;
        const starChannelID = await reaction.message.guild.settings.get('starboard.channel');
        if (!starChannelID) return false;

        const starChannel = await reaction.message.guild.channels.cache.get(starChannelID);
        if (!starChannel) return false;

        if (!reaction.message.guild.me.permissionsIn(starChannel).has('VIEW_CHANNEL')) return;

        const isStarChannel = reaction.message.channel.id === starChannelID;
        if (isStarChannel) return false;

        if (reaction.message.channel.id === "779239210360111116") return false;
        if (user.id === this.client.user.id) return false;


        if (!['⭐', '🌞', '🌠', '🌟', '✨'].includes(reaction.emoji?.name)) return false;

        let threshold = await reaction.message.guild.settings.get('starboard.minimum');
        if (!threshold) threshold = 3;
        if (reaction.count < threshold) return false;
        let nostar = await reaction.message.guild.settings.get('starboard.nostar');
        if (nostar?.includes(reaction.message.channel.id)) return false;
        let self = await reaction.message.guild.settings.get('starboard.self');
        if (self === false && reaction.message.author.id === user.id) return false;

        return this.client.emit('starCreated', reaction, user, reaction.message.guild, { channel: starChannel, minimum: threshold });
    }
}