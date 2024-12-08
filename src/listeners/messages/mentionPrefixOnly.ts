import { readSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EnvKeys, EventArgs, FoxxieEvents } from '#lib/types';
import { isAdmin } from '#utils/discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';
import { cast } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { LocaleString, Message, userMention } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: FoxxieEvents.MentionPrefixOnly
})
export class UserListener extends Listener<FoxxieEvents.MentionPrefixOnly> {
	public async run(...[message]: EventArgs<FoxxieEvents.MentionPrefixOnly>) {
		return message.inGuild() ? this.runGuildContext(message) : this.runDMContext(message);
	}

	private async runGuildContext(message: Message<true>) {
		const { prefix, language } = await readSettings(message.guild);
		const t = this.container.i18n.getT(cast<LocaleString>(language));

		const content = this.formatPrefix(prefix, t, isAdmin(message.member!));

		return send(message, content);
	}

	private async runDMContext(message: Message) {
		const prefix =
			(await this.container.client.fetchPrefix(message)) ??
			envParseString(EnvKeys.ClientPrefix) ??
			`${userMention(this.container.client.id!)} `;
		const t = await fetchT(message);

		const content = this.formatPrefix(Array.isArray(prefix) ? prefix[0] : prefix, t);

		return send(message, content);
	}

	private formatPrefix(prefix: string, t: TFunction, isAdmin = false): string {
		const lines = [
			t(LanguageKeys.System.PrefixReminder, {
				prefixes: [prefix],
				count: 1
			})
		];

		if (isAdmin) {
			lines.push(
				t(LanguageKeys.System.PrefixReminder, {
					context: 'admin',
					prefix
				})
			);
		}

		return lines.join('\n');
	}
}