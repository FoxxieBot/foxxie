import { Serializer, SerializerUpdateContext } from '#lib/database';
import type { Awaitable } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';

export class UserSerializer extends Serializer<string> {
    public async parse(args: Serializer.Args) {
        const role = await args.pickResult('role');
        return role.success ? this.ok(role.value.id) : this.errorFromArgument(args, role.error);
    }

    public isValid(value: string, { t, entry, guild }: SerializerUpdateContext): Awaitable<boolean> {
        if (guild.roles.cache.has(value)) return true;
        throw t(LanguageKeys.Serializers.InvalidRole, { name: entry.name });
    }

    public stringify(value: string, { guild, t }: SerializerUpdateContext) {
        return guild.roles.cache.get(value)?.name ?? t(LanguageKeys.Serializers.UnknownRole);
    }
}
