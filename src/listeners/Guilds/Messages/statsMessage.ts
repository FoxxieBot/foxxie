import { GuildSettings } from '#lib/Database';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { minutes } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { cyan } from 'colorette';
import type { GuildMember } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.StatsMessage
})
export class UserListener extends Listener<FoxxieEvents.StatsMessage> {
    public timeout = minutes(5);

    public async run(...[guildId, member]: EventArgs<FoxxieEvents.StatsMessage>): Promise<void[]> {
        // if the member hasn't been in the server for five mintutes disregard the messages.
        if (Date.now() - member.joinedTimestamp! < this.timeout) return [];

        return Promise.all([this.countGuild(guildId), this.countMember(member, guildId), this.countClient()]);
    }

    private async countGuild(guildId: string): Promise<void> {
        await this.container.settings.writeGuild(guildId, settings => {
            const newCount = settings[GuildSettings.MessageCount] + 1;
            this.container.logger.debug(
                `[${cyan('StatsMessage')}] - ${`Updated guild [${cyan(guildId)}] message count - [${cyan(newCount.toLocaleString())}]`}`
            );
            return { messageCount: newCount };
        });
    }

    private async countMember(member: GuildMember, guildId: string): Promise<void> {
        const memberEntity = await this.container.db.members.ensure(member.id, guildId);
        memberEntity.messageCount += 1;
        await memberEntity.save();
        this.container.logger.debug(
            `[${cyan('StatsMessage')}] - ${`Updated member [${cyan(member.displayName)}] message count - [${cyan(memberEntity.messageCount.toLocaleString())}]`}`
        );
    }

    private async countClient(): Promise<void> {
        const client = await this.container.db.clients.ensure();
        client.messageCount += 1;
        await client.save();
        this.container.logger.debug(
            `[${cyan('StatsMessage')}] - ${`Updated client message count - [${cyan(client.messageCount.toLocaleString())}]`}`
        );
    }
}
