import { StarboardManager } from '#lib/Structures/managers/StarboardManager';
import { GuildMessage } from '#lib/Types';
import { defaultStarboardEmojis } from '#utils/Discord';
import { Colors } from '#utils/constants';
import { fetchReactionUsers, floatPromise, getAttachment, getImage, isVideo } from '#utils/util';
import { bold } from '@discordjs/builders';
import { cast, resolveToNull } from '@ruffpuff/utilities';
import { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/pieces';
import { MessageOptions } from '@sapphire/plugin-editable-commands';
import { cutText, debounce, isNullish } from '@sapphire/utilities';
import { RESTJSONErrorCodes } from 'discord-api-types/v10';
import { DiscordAPIError, EmbedBuilder, HTTPError, Message, MessageEditOptions, TextBasedChannel } from 'discord.js';
import { TFunction } from 'i18next';
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { GuildSettings, acquireSettings } from '..';

@Entity('starboard', { schema: 'public' })
export class StarEntity extends BaseEntity {
    #users = new Set<string>();

    #manager: StarboardManager = null!;

    #message: GuildMessage = null!;

    #starMessage: GuildMessage | null = null;

    #updateStarMessage = debounce(this.updateStarMessage.bind(this), { wait: 2500, maxWait: 10000 });

    @ObjectIdColumn()
    public _id!: string;

    @Column('boolean')
    public enabled = true;

    @Column('varchar', { length: 19 })
    public userId: string = null!;

    @PrimaryColumn('varchar', { length: 19 })
    public messageId: string = null!;

    @Column('varchar', { length: 19 })
    public channelId: string = null!;

    @PrimaryColumn('varchar', { length: 19 })
    public guildId: string = null!;

    @Column('varchar', { nullable: true, length: 19 })
    public starMessageId: string | null = null;

    @Column('integer')
    public stars = 0;

    public lastUpdated = Date.now();

    public setup(manager: StarboardManager) {
        this.#manager = manager;
    }

    public init(manager: StarboardManager, message: GuildMessage) {
        this.setup(manager);
        this.#message = message;
        this.messageId = message.id;
        this.channelId = message.channel.id;
        this.guildId = manager.guild.id;
        this.userId = message.author.id;
        return this;
    }

    public async disable(): Promise<boolean> {
        if (!this.enabled) return false;
        await this.edit({ enabled: false });
        return true;
    }

    public async enable(): Promise<boolean> {
        if (this.enabled) return false;
        await this.edit({ enabled: true });
        await this.downloadUserList();
        return true;
    }

    public async increment(id: string, selfStarring: boolean): Promise<void> {
        if (this.#message.author.id === id && !selfStarring) return;
        this.#users.add(id);
        await this.edit({ stars: this.#users.size });
    }

    public async decrement(id: string): Promise<void> {
        this.#users.delete(id);
        await this.edit({ stars: this.#users.size });
    }

    public async edit(options: Partial<StarEntity>): Promise<this> {
        this.lastUpdated = Date.now();

        // If a message was in progress to be sent, await it first
        const previousUpdate = this.#manager.syncMessageMap.get(this);
        if (previousUpdate) await previousUpdate;

        if (Reflect.has(options, 'enabled')) {
            this.enabled = options.enabled!;
        }
        if (Reflect.has(options, 'stars') && this.enabled) {
            this.stars = options.stars!;
            await this.#updateStarMessage();
        }
        if (options.starMessageId === null) {
            this.starMessageId = null;
            this.#starMessage = null;
        }

        await this.save();
        return this;
    }

    public async downloadStarMessage(): Promise<void> {
        if (!this.starMessageId) return;

        const channelId = await this.settings.get(s => s.starboard[GuildSettings.Starboard.Channel]);
        if (isNullish(channelId)) return;

        const channel = cast<GuildTextBasedChannelTypes | undefined>(this.#message.guild.channels.cache.get(channelId));
        if (isNullish(channel)) {
            await this.settings.set(settings => (settings.starboard[GuildSettings.Starboard.Channel] = null));
            return;
        }

        try {
            this.#starMessage = cast<GuildMessage>(await channel.messages.fetch(this.starMessageId));
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.remove();
            }
        }
    }

    public async downloadUserList(): Promise<void> {
        try {
            const [emojis, selfStar] = await acquireSettings(this.#message.guild, s => [
                s.starboard[GuildSettings.Starboard.Emojis],
                s.starboard[GuildSettings.Starboard.SelfStar]
            ]);
            const users1 = await fetchReactionUsers(this.#message.channel.id, this.#message.id, [
                ...emojis,
                ...defaultStarboardEmojis
            ]);

            const users2 = this.#starMessage
                ? await fetchReactionUsers(this.#starMessage?.channel.id, this.#starMessage.id, [
                      ...emojis,
                      ...defaultStarboardEmojis
                  ])
                : [];

            this.#users = new Set([...users1, ...users2].filter(user => user !== container.client.id));

            // Remove the author's star if self star is disabled:
            if (!selfStar) this.#users.delete(this.#message.author.id);
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                if (error.code === RESTJSONErrorCodes.MissingAccess) return;
                if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.remove();
                return;
            }
        }

        if (!this.#users.size) {
            await this.remove();
            return;
        }

        this.stars = this.#users.size;
    }

    private async getStarContent(t: TFunction): Promise<MessageOptions | MessageEditOptions> {
        const color = await this.color();

        const message = this.#message;
        const attachment = getAttachment(message);
        const video = isVideo(attachment);
        const shouldSplit = this.#message.content.length > 1800;
        const possibleRefrence = await this.getRefrencedMessage(this.#message);

        const options: { embeds: EmbedBuilder[]; content: null | string } = { embeds: [], content: null };

        if (possibleRefrence) {
            options.embeds.push(
                new EmbedBuilder()
                    .setAuthor({
                        name: possibleRefrence.member?.displayName || possibleRefrence.author.username,
                        iconURL: possibleRefrence.author.displayAvatarURL({ size: 128 })
                    })
                    .setColor(await this.refrencedColor(possibleRefrence))
                    .setImage(getImage(possibleRefrence)!)
                    .setDescription(possibleRefrence.content || null)
            );
        }

        if (shouldSplit) {
            const split = this.#message.content.split(`(?<=\\G.{${1800}})`);
            const i = 0;
            const url = await this.getUrl();

            for (const slice of split) {
                const ended = i + 1 === split.length;
                console.log(split, ended);

                options.embeds.push(
                    new EmbedBuilder()
                        .setAuthor({
                            name: message.member?.displayName || message.author.username,
                            iconURL: message.author.displayAvatarURL({ size: 128 })
                        })
                        .setColor(color)
                        .setImage(getImage(message)!)
                        .setDescription(
                            // eslint-disable-next-line no-implicit-coercion
                            [slice, ended ? '' : null, ended ? `${url}` : null].filter(a => a !== null).join('\n')
                        )
                );
            }
        } else {
            options.embeds.push(
                new EmbedBuilder()
                    .setAuthor({
                        name: message.member?.displayName || message.author.username,
                        iconURL: message.author.displayAvatarURL({ size: 128 })
                    })
                    .setColor(color)
                    .setImage(getImage(message)!)
                    .setDescription(await this.getContent(t))
            );
        }

        if (video && attachment) {
            options.content = attachment.url;
        }

        return options;
    }

    private async color() {
        const guild = container.client.guilds.cache.get(this.guildId);
        if (!guild) return Colors.TheCornerStoreStarboard;
        const member = await resolveToNull(guild.members.fetch(this.userId));
        if (!member) return Colors.TheCornerStoreStarboard;

        return member.displayColor || Colors.TheCornerStoreStarboard;
    }

    private async refrencedColor(ref: Message) {
        const guild = container.client.guilds.cache.get(this.guildId);
        if (!guild) return Colors.TheCornerStoreStarboard;
        const member = await resolveToNull(guild.members.fetch(ref.author.id));
        if (!member) return Colors.TheCornerStoreStarboard;

        return member.displayColor || Colors.TheCornerStoreStarboard;
    }

    private async getContent(_: TFunction) {
        const url = await this.getUrl();
        return [cutText(this.#message.content, 1800), '', url].join('\n');
    }

    private async getUrl() {
        const possibleRefrence = await this.getRefrencedMessage(this.#message);

        const url = `${this.emoji} ${bold(this.stars.toString())} | <#${this.channelId}> | [Jump to Message](${
            this.#message.url
        })${possibleRefrence ? ` | [Jump to Refrenced Message](${possibleRefrence.url})` : ''}`;

        return url;
    }

    private async getRefrencedMessage(message: GuildMessage) {
        if (
            message.reference &&
            message.reference.messageId &&
            message.reference.guildId &&
            message.reference.channelId === message.channelId &&
            message.reference.guildId === message.guildId
        ) {
            const referencedGuild = await container.client.guilds.fetch(message.reference.guildId);
            if (!referencedGuild) return null;
            const referencedChannel = cast<TextBasedChannel>(await referencedGuild.channels.fetch(message.reference.channelId));

            if (!referencedChannel) return null;

            const referencedMessage = await referencedChannel.messages.fetch(message.reference.messageId);

            return referencedMessage || null;
        }

        return null;
    }

    private async updateStarMessage(): Promise<void> {
        const [minimum, channelId, t] = await acquireSettings(this.#message.guild, settings => [
            settings.starboard[GuildSettings.Starboard.Minimum],
            settings.starboard[GuildSettings.Starboard.Channel],
            settings.getLanguage()
        ]);

        if (this.stars === 0 && this.#starMessage) {
            try {
                await this.#starMessage.delete();
                await this.remove();
                return;
            } catch (error) {
                if (!(error instanceof DiscordAPIError) || !(error instanceof HTTPError)) return;

                if (error.code === RESTJSONErrorCodes.MissingAccess) return;
                if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.edit({ starMessageId: null, enabled: false });
            }
        }

        if (this.stars < minimum || isNullish(channelId)) return;

        if (this.#starMessage) {
            try {
                const options = await this.getStarContent(t);
                await this.#starMessage.edit(options as MessageEditOptions);
            } catch (error) {
                if (!(error instanceof DiscordAPIError) || !(error instanceof HTTPError)) return;

                if (error.code === RESTJSONErrorCodes.MissingAccess) return;
                if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.edit({ starMessageId: null, enabled: false });
            }

            return;
        }

        if (this.#message.author.bot) return;

        const channel = cast<GuildTextBasedChannelTypes | undefined>(this.#message.guild.channels.cache.get(channelId));
        if (!channel) return;

        const options = await this.getStarContent(t);
        const promise = channel
            .send({ embeds: options.embeds!, content: options.content ?? undefined })
            .then(message => {
                this.#starMessage = cast<GuildMessage>(message);
                this.starMessageId = message.id;
            })
            .catch(error => {
                if (!(error instanceof DiscordAPIError) || !(error instanceof HTTPError)) return;

                if (error.code === RESTJSONErrorCodes.MissingAccess) return;
                // Emit to console
                container.logger.fatal(error);
            })
            .finally(async () => {
                this.#manager.syncMessageMap.delete(this);
                if (this.#starMessage) await floatPromise(this.#starMessage.react('%E2%AD%90'));
                await this.save();
            });

        this.#manager.syncMessageMap.set(this, promise);
        await promise;
    }

    private get settings() {
        const { settings } = container.utilities.guild(this.#message.guild);
        return settings;
    }

    private get emoji() {
        const { stars } = this;
        if (stars < 5) return '⭐';
        if (stars < 10) return '🌟';
        if (stars < 25) return '💫';
        if (stars < 100) return '✨';
        if (stars < 200) return '🌠';
        return '🌌';
    }
}
