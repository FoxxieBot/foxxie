import type { Guild } from 'discord.js';
import { GuildSettings, PartialResponseValue, ResponseType, Task } from '#lib/database';
import { LockQueue } from '@foxxie/lock-queue';
import { container } from '@sapphire/pieces';
import { seconds } from '@ruffpuff/utilities';

export abstract class ModerationTask<T = unknown> extends Task {
    private readonly locks = new LockQueue();

    public async run(data: ModerationData<T>): Promise<PartialResponseValue> {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (typeof guild === 'undefined') return { type: ResponseType.Ignore };

        if (!guild.available) return { type: ResponseType.Delay, value: seconds(20) };

        await this.locks.write(data.guildId);

        try {
            await this.handle(guild, data);
            // eslint-disable-next-line no-empty
        } finally {
            this.locks.delete(data.guildId);
        }

        return { type: ResponseType.Finished };
    }

    protected async fetchMe(guild: Guild) {
        return guild.me === null ? guild.members.fetch(process.env.CLIENT_ID!) : guild.me;
    }

    protected async getDmData(guild: Guild): Promise<{ send: boolean }> {
        return {
            send: await container.db.guilds.acquire(guild.id, GuildSettings.Moderation.Dm)
        };
    }

    protected ctx(duration: number) {
        return {
            context: 'reason',
            duration
        } as const;
    }

    protected abstract handle(guild: Guild, data: ModerationData<T>): unknown;
}

export interface ModerationData<T = unknown> {
    caseId: number;
    userId: string;
    guildId: string;
    duration: number;
    channelId: string;
    moderatorId: string;
    extra: T;
    scheduleRetryCount?: number;
}

// eslint-disable-next-line no-redeclare
export namespace ModerationTask {
    export type Options = Task.Options;
}
