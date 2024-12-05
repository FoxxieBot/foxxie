import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/types';
import { floatPromise } from '#utils/util';
import { Listener } from '@sapphire/framework';
import { cast, isNullish } from '@sapphire/utilities';

export class UserListener extends Listener<FoxxieEvents.MessageCreate> {
	public async run(...[message]: EventArgs<FoxxieEvents.MessageCreate>): Promise<void> {
		if (isNullish(message.guild) || isNullish(message.member)) return;

		if (message.system) {
			this.container.client.emit(FoxxieEvents.SystemMessage, cast<GuildMessage>(message));
			return;
		}

		if (message.channel.id === '1307441764856107118') {
			await floatPromise(message.delete());
			return;
		}

		if (message.author.bot) {
			this.container.client.emit(FoxxieEvents.BotMessage, cast<GuildMessage>(message));
		} else {
			this.container.client.emit(FoxxieEvents.UserMessage, cast<GuildMessage>(message));
		}

		this.container.client.emit(FoxxieEvents.StatsMessage, message.guild.id, message.member);
	}
}
