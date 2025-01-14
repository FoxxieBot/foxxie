import type { GuildMessage } from '#lib/types';

import { inlineCode } from '@discordjs/builders';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { filter } from '@sapphire/iterator-utilities/filter';
import { map } from '@sapphire/iterator-utilities/map';
import { toArray } from '@sapphire/iterator-utilities/toArray';
import { send } from '@sapphire/plugin-editable-commands';
import { isNullish, toTitleCase } from '@sapphire/utilities';
import { getConfigurableGroups } from '#lib/database/settings/configuration';
import { readSettings, writeSettingsTransaction } from '#lib/database/settings/functions';
import { SchemaKey } from '#lib/database/settings/schema/SchemaKey';
import { isSchemaKey, remove, reset, set } from '#lib/database/settings/Utils';
import { LanguageKeys } from '#lib/i18n';
import { SettingsMenu } from '#lib/structures';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { PermissionLevels } from '#lib/types';
import { isValidCustomEmoji, isValidSerializedTwemoji, isValidTwemoji } from '#utils/functions/emojis';
import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['settings', 'config', 'configs', 'configuration'],
	description: LanguageKeys.Commands.Configuration.Conf.Description,
	detailedDescription: LanguageKeys.Commands.Configuration.Conf.DetailedDescription,
	guarded: true,
	permissionLevel: PermissionLevels.Administrator,
	runIn: [CommandOptionsRunTypeEnum.GuildAny],
	subcommands: [
		{ messageRun: 'set', name: 'set' },
		{ messageRun: 'set', name: 'add' },
		{ messageRun: 'show', name: 'show' },
		{ messageRun: 'remove', name: 'remove' },
		{ messageRun: 'reset', name: 'reset' },
		{ default: true, messageRun: 'menu', name: 'menu' }
	]
})
export class UserCommand extends FoxxieSubcommand {
	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	public menu(message: GuildMessage, args: FoxxieSubcommand.Args, context: FoxxieSubcommand.RunContext) {
		return new SettingsMenu(message, args.t).init(context);
	}

	public async remove(message: GuildMessage, args: FoxxieSubcommand.Args) {
		const [key, schemaKey] = await this.#fetchKey(args);

		using trx = await writeSettingsTransaction(message.guild);
		await trx.write(await remove(trx.settings, schemaKey, args)).submit();

		const response = schemaKey.display(trx.settings, args.t);
		return send(message, {
			allowedMentions: { roles: [], users: [] },
			content: args.t(LanguageKeys.Commands.Configuration.Conf.Updated, { key, response: this.#getTextResponse(response) })
		});
	}

	public async reset(message: GuildMessage, args: FoxxieSubcommand.Args) {
		const [key, schemaKey] = await this.#fetchKey(args);

		using trx = await writeSettingsTransaction(message.guild);
		await trx.write(reset(schemaKey)).submit();

		const response = schemaKey.display(trx.settings, args.t);
		return send(message, {
			allowedMentions: { roles: [], users: [] },
			content: args.t(LanguageKeys.Commands.Configuration.Conf.Reset, { key, value: response })
		});
	}

	public async set(message: GuildMessage, args: FoxxieSubcommand.Args) {
		const [key, schemaKey] = await this.#fetchKey(args);

		using trx = await writeSettingsTransaction(message.guild);
		await trx.write(await set(trx.settings, schemaKey, args)).submit();

		const response = schemaKey.display(trx.settings, args.t);
		return send(message, {
			allowedMentions: { roles: [], users: [] },
			content: args.t(LanguageKeys.Commands.Configuration.Conf.Updated, { key, response: this.#getTextResponse(response) })
		});
	}

	public async show(message: GuildMessage, args: FoxxieSubcommand.Args) {
		const key = args.finished ? '' : await args.pick('string');
		const schemaValue = this.#resolveSchemaValue(key);

		const settings = await readSettings(message.guild);
		const output = schemaValue.display(settings, args.t);

		if (isSchemaKey(schemaValue)) {
			const content = args.t(LanguageKeys.Commands.Configuration.Conf.Get, { key: schemaValue.name, value: output });
			return send(message, { allowedMentions: { roles: [], users: [] }, content });
		}

		const title = this.#getShowTitle(key);

		return send(message, {
			allowedMentions: { roles: [], users: [] },
			content: args.t(LanguageKeys.Commands.Configuration.Conf.Server, { key: title, list: output })
		});
	}

	async #fetchKey(args: ChatInputCommandInteraction | FoxxieSubcommand.Args) {
		const key = args instanceof ChatInputCommandInteraction ? args.options.getString('key', true) : await args.pick('string');

		const value = getConfigurableGroups().getPathString(key.toLowerCase());
		if (isNullish(value) || value.dashboardOnly) {
			this.error(LanguageKeys.Commands.Configuration.Conf.GetNoExist, { key });
		}

		if (isSchemaKey(value)) {
			return [value.name, value as SchemaKey] as const;
		}

		const keys = map(
			filter(value.childValues(), (value) => !value.dashboardOnly),
			(value) => inlineCode(value.name)
		);
		this.error(LanguageKeys.Settings.Gateway.ChooseKey, { keys: toArray(keys) });
	}

	#getShowTitle(key: string) {
		return key
			? `: ${key
					.split('.')
					.map((key) => toTitleCase(key))
					.join('/')}`
			: '';
	}

	#getTextResponse(response: string) {
		return isValidCustomEmoji(response) || isValidSerializedTwemoji(response) || isValidTwemoji(response) ? response : inlineCode(response);
	}

	#resolveSchemaValue(key: string) {
		const schemaValue = getConfigurableGroups().getPathString(key.toLowerCase());
		if (schemaValue === null) this.error(LanguageKeys.Commands.Configuration.Conf.GetNoExist, { key });
		return schemaValue;
	}
}
