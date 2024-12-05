import { LanguageKeys, translate } from '#lib/i18n';
import { ModerationManager } from '#lib/moderation';
import { getModeration } from '#utils/functions';
import { err, ok, Resolvers, Result, UserError } from '@sapphire/framework';
import { TFunction } from '@sapphire/plugin-i18next';
import { Guild } from 'discord.js';

export async function resolveCaseId(parameter: string, t: TFunction, guild: Guild): Promise<Result<number, UserError>> {
	const maximum = await getModeration(guild).getCurrentId();
	if (maximum === 0) return err(new UserError({ identifier: LanguageKeys.Arguments.CaseNoEntries }));

	if (t(LanguageKeys.Arguments.CaseLatestOptions).includes(parameter)) return ok(maximum);
	return Resolvers.resolveInteger(parameter, { minimum: 1, maximum }) //
		.mapErr((error) => new UserError({ identifier: translate(error), context: { parameter, minimum: 1, maximum } }));
}

export async function resolveCase(parameter: string, t: TFunction, guild: Guild): Promise<Result<ModerationManager.Entry, UserError>> {
	const result = await resolveCaseId(parameter, t, guild);
	return result.match({
		ok: async (value) => {
			const entry = await getModeration(guild).fetch(value);
			return entry ? ok(entry) : err(new UserError({ identifier: LanguageKeys.Arguments.CaseUnknownEntry, context: { parameter } }));
		},
		err: (error) => err(error)
	});
}
