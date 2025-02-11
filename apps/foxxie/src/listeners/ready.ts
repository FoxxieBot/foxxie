import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Store } from '@sapphire/framework';
import { envIsDefined, envParseBoolean } from '@skyra/env-utilities';
import { resetSpotifyToken } from '#lib/api/Spotify/util';
import { EnvKeys, FoxxieEvents } from '#lib/types';
import { seconds } from '#utils/common';
import { Schedules } from '#utils/constants';
import { createBanner } from '#utils/startBanner';
import { blue, blueBright, gray, green, red, yellow } from 'colorette';

@ApplyOptions<Listener.Options>({ once: true })
export class UserListener extends Listener<FoxxieEvents.Ready> {
	private readonly style = this.isDev ? yellow : blue;

	public async run() {
		const [spotify] = await Promise.all([this.#initSpotify(), this.#startLavalink()]);

		this.printBanner(spotify);
		this.printStoreDebugInformation();
	}

	async #initSpotify() {
		if (!envIsDefined(EnvKeys.SpotifyClientId) || !envIsDefined(EnvKeys.SpotifyClientSecret)) return false;
		const success = await resetSpotifyToken();
		return success;
	}

	#startLavalink() {
		if (this.container.client.audio)
			setTimeout(async () => {
				await this.container.client.audio!.connect();
				await this.container.client.audio!.queues.start();
				this.container.logger.info(`[${blueBright('Lavalink')}]: Successfully initialized.`);
			}, seconds(30));
	}

	private printBanner(spotify: boolean) {
		const success = green('+');
		const failed = red('-');
		const pad = ' '.repeat(5);
		const sevenPad = ' '.repeat(7);
		const tenPad = ' '.repeat(10);

		const modules = {
			audio: `[${envParseBoolean('AUDIO_ENABLED', false) ? success : failed}] Audio${tenPad}`,
			birthday: `[${this.container.stores.get('tasks').has(Schedules.Birthday) ? success : failed}] Birthday${sevenPad}`,
			moderation: `[${success}] Moderation${pad}`,
			redis: `[${this.container.redis ? success : failed}] Redis`,
			spotify: `[${spotify ? success : failed}] Spotify`,
			starboard: `[${this.store.has('rawMessageReactionAddStarboard') ? success : failed}] Starboard`,
			statusPage: `[${this.container.stores.get('tasks').has(Schedules.CheckStatusPage) ? success : failed}] Status Page`
		};

		console.log(
			String(
				createBanner({
					extra: [
						String.raw`${pad}${pad}${`v${process.env.VERSION_NUM}${this.isDev ? '-dev' : ''}${process.env.VERSION_SIG ? ` ${process.env.VERSION_SIG}` : ''}${process.env.COPYRIGHT_YEAR ? ` © ${process.env.COPYRIGHT_YEAR}` : ''}`.padStart(
							38,
							' '
						)}`,
						String.raw`${pad}[${success}] Gateway`,
						String.raw`${pad}${modules.audio}${modules.spotify}`,
						String.raw`${pad}${modules.birthday}${modules.starboard}`,
						String.raw`${pad}${modules.moderation}${modules.statusPage}`,
						String.raw`${pad}${modules.redis}`,
						String.raw`${this.isDev ? `${pad}</> DEVELOPMENT MODE` : ''}`
					],
					logo: [
						String.raw`         `,
						String.raw`       }_{ __{`,
						String.raw`    .-{   }   }-.`,
						String.raw`   (   }     {   )`,
						String.raw`   |"-.._____..-'|`,
						String.raw`   |             ;--.`,
						String.raw`   |            (__  \\`,
						String.raw`   |             | )  )`,
						String.raw`   |             |/  /`,
						String.raw`   |             /  /`,
						String.raw`   |            (  /`,
						String.raw`   \\            y'`,
						String.raw`    "-.._____..-'`
					],
					name: [
						String.raw`,____`,
						String.raw`/\  _ "\                    __`,
						String.raw`\ \ \L\_\___   __  _  __  _/\_\    ____`,
						String.raw` \ \  _\/ __"\/\ \/'\/\ \/'\/\ \  /'__"\ `,
						String.raw`  \ \ \/\ \L\ \/>  </\/>  </\ \ \/\  __/`,
						String.raw`   \ \_\ \____//\_/\_\/\_/\_\\ \_\ \___"\ `,
						String.raw`    \/_/\/___/ \//\/_/\//\/_/ \/_/\/____/`
					]
				})
			)
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store));
		logger.info(gray(`├─ Loaded ${this.style((2).toString().padEnd(3, ' '))} languages.`));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last = false) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}

	private get isDev() {
		return this.container.client.development;
	}
}
