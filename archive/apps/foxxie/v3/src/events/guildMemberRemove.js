const { Event } = require('@foxxie/tails');
const { Timestamp } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'guildMemberRemove'
        })

        this.timestamp = new Timestamp('MMMM d YYYY');
    }

    run(member) {

        // Returns if self
        if (member.user.id === this.client.user.id) return;

        // Sets roles and nickname in db
        member.user.settings.set(`servers.${member.guild.id}.persistRoles`, member.roles.cache.keyArray());
        if (member.nickname) member.user.settings.set(`servers.${member.guild.id}.persistNickname`, member.nickname);

        // Goodbye
        this.goodbye(member);

        member.guild.log.send({ member, type: 'member', action: 'memberLeft' });
    }

    async goodbye(member) {

        if (member.guild.id === '761512748898844702') this.client.events.get('theCornerStore').memberCount(member);

        const { guild } = member;
        const channelId = await guild.settings.get('goodbye.channel');
        if (!channelId) return member;
        const channel = guild.channels.cache.get(channelId);
        if (!channel) return member;

        let message = await guild.settings.get('goodbye.message');
        if (!message) {
            channel.send(guild.language.get('EVENT_GUILDMEMBERREMOVE_DEFAULT', member.user.tag)).catch(e => e);
            return member;
        };

        const parsed = await this._fillTemplate(message, member);
        channel.send(parsed).catch(e => e);
    }

    _fillTemplate(template, member) {
        return template
            .replace(/{(name|username)}/gi, member.user.username)
            .replace(/{tag}/gi, member.user.tag)
            .replace(/{(discrim|discriminator)}/gi, member.user.discriminator)
            .replace(/{(guild|server)}/gi, member.guild.name)
            .replace(/{(membercount|count)}/gi, member.guild.memberCount)
            .replace(/{(joined|joinedat)}/gi, this.timestamp.display(member.joinedAt));
    }
}