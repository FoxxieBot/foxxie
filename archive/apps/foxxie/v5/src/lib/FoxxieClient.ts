import { container, SapphireClient, SapphirePrefix } from '@sapphire/framework';
import { CLIENT_OPTIONS, WEBHOOK_ERROR } from '#root/config';
import { envParseBoolean, envParseInt } from '#lib/env';
import { Message, WebhookClient } from 'discord.js';
import { magentaBright } from 'colorette';
import { Enumerable } from '@sapphire/decorators';
import { GuildMemberFetchQueue } from '#external/GuildMemberFetchQueue';
import { acquireSettings, GuildSettings, SettingsManager } from '#lib/database';
import type { LongLivingReactionCollector } from '#external/LongLivingReactionCollector';
import { AnalyticsManager, GiveawayManager, InviteManager, RedisManager, WorkerManager } from './structures';
import { FoxxieQueue } from './audio';
import { isDev } from '@ruffpuff/utilities';
import { Leaderboard } from '#utils/Leaderboard';

export default class FoxxieClient extends SapphireClient {
    @Enumerable(false)
    public webhookError: WebhookClient | null = WEBHOOK_ERROR ? new WebhookClient(WEBHOOK_ERROR) : null;

    @Enumerable(false)
    public readonly guildMemberFetchQueue = new GuildMemberFetchQueue();

    @Enumerable(false)
    public giveaways = new GiveawayManager();

    @Enumerable(false)
    public llrCollectors = new Set<LongLivingReactionCollector>();

    @Enumerable(false)
    public audio: FoxxieQueue | null = null;

    @Enumerable(false)
    public invites = new InviteManager();

    @Enumerable(false)
    public leaderboard = new Leaderboard();

    public constructor() {
        super(CLIENT_OPTIONS);

        container.workers = new WorkerManager(3);

        container.analytics = envParseBoolean('INFLUX_ENABLED', false) ? new AnalyticsManager() : null;

        container.settings = new SettingsManager();

        container.redis = envParseBoolean('REDIS_ENABLED', false)
            ? new RedisManager({
                  host: process.env.REDIS_HOST,
                  port: envParseInt('REDIS_PORT'),
                  password: process.env.REDIS_PASSWORD,
                  lazyConnect: true
              })
            : null;

        this.audio = envParseBoolean('AUDIO_ENABLED', false)
            ? new FoxxieQueue(CLIENT_OPTIONS.audio, (guildID, packet) => {
                  const guild = this.guilds.cache.get(guildID);
                  if (guild) guild.shard.send(packet);
                  return undefined;
              })
            : null;
    }

    public fetchPrefix = async (message: Message): Promise<SapphirePrefix> => {
        if (!message.guild) return process.env.CLIENT_PREFIX!;
        if (process.env.NODE_ENV !== 'production') return process.env.CLIENT_PREFIX!;
        return (await acquireSettings(message.guild, GuildSettings.Prefix))!;
    };

    public async login(): Promise<string> {
        const { shardCount } = CLIENT_OPTIONS;
        container.logger.info(`${magentaBright('Gateway:')} Logging in with ${shardCount ?? 1} shard${(shardCount ?? 1) > 1 ? 's' : ''}`);

        await this.giveaways.init().catch(err => {
            container.logger.fatal(err);
        });
        return super.login();
    }

    public destroy(): void {
        this.guildMemberFetchQueue.destroy();
        super.destroy();
    }

    public get development() {
        return isDev();
    }
}
