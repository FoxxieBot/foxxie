import type { CommandName } from '#types/Interactions';
import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { createClassDecorator, createProxy } from '@sapphire/decorators';
import { Command, container, RegisterBehavior } from '@sapphire/framework';
import type { Ctor } from '@sapphire/utilities';
import { Locale } from 'discord-api-types/v10';
import type { AutocompleteInteraction, CommandInteraction, CommandInteractionOption, SelectMenuInteraction } from 'discord.js';
import { getGuildIds } from './util';

export function RegisterChatInputCommand<N extends CommandName>(
    name: N,
    builder:
        | SlashCommandBuilder
        | ((
              builder: SlashCommandBuilder
          ) =>
              | SlashCommandBuilder
              | SlashCommandSubcommandsOnlyBuilder
              | SlashCommandOptionsOnlyBuilder
              | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>),
    idHints: string[],
    options: Command.Options = {}
) {
    const registry = container.applicationCommandRegistries.acquire(name);

    const build = typeof builder === 'function' ? builder(new SlashCommandBuilder()) : new SlashCommandBuilder();
    if (!build.name) build.setName(name);
    const json = build.toJSON();

    registry.registerChatInputCommand(build, {
        guildIds: getGuildIds(),
        idHints,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite
    });

    return createClassDecorator((command: Ctor) => {
        const subcommands = json.options?.filter(opt => opt.type === 1);

        if (subcommands?.length) {
            for (const subcommand of subcommands) {
                applyWrapperToMethod(command, subcommand.name);
            }
        } else {
            applyWrapperToMethod(command, 'chatInputRun');
        }

        return createProxy(command, {
            construct: (ctor, [context, base = {}]) =>
                new ctor(context, {
                    ...base,
                    ...{
                        description: build.description,
                        name: build.name,
                        ...options
                    }
                })
        });
    });
}

function applyWrapperToMethod(command: Ctor, name: string) {
    const func = command.prototype[name];

    // eslint-disable-next-line @typescript-eslint/require-await
    command.prototype[name] = async function descriptorValue(this: (...args: any[]) => any, ...args: any[]) {
        const interaction = args[0] as CommandInteraction;
        const raw: Record<string, any> = parseArgs(interaction.options.data as any, {});

        raw.t = getLocale(interaction);

        return func!.call(this, ...[...args, raw].filter(a => Boolean(a)));
    } as unknown as undefined;
}

function parseArgs(options: CommandInteractionOption[], raw: Record<string, any>) {
    for (const arg of options) {
        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (arg.type) {
            case 'SUB_COMMAND':
            case 'SUB_COMMAND_GROUP':
                raw[arg.name] = parseArgs(arg.options ? [...arg.options] : [], {});
                break;
            case 'USER':
                raw[arg.name] = { user: arg.user, member: arg.member };
                break;
            case 'CHANNEL':
                raw[arg.name] = arg.channel;
                break;
            case 'ROLE':
                raw[arg.name] = arg.role;
                break;
            default:
                raw[arg.name] = arg.value;
        }
    }

    return raw;
}

export function getLocale(interaction: CommandInteraction | SelectMenuInteraction | AutocompleteInteraction) {
    const string = (interaction.locale ?? interaction.guildLocale) as Locale;
    let loc: string;

    switch (string) {
        case Locale.SpanishES:
            loc = 'es-MX';
            break;
        case Locale.Japanese:
            loc = 'ja-JP';
            break;
        case Locale.French:
            loc = 'fr-FR';
            break;
        default:
            loc = string;
            break;
    }

    return container.i18n.languages.has(loc) ? container.i18n.getT(loc) : container.i18n.getT('en-US');
}
