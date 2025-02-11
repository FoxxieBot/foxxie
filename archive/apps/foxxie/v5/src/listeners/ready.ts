import { Listener, Store } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { blue, blueBright, gray, green, magenta, magentaBright, red, white, yellow } from 'colorette';
import { envParseBoolean } from '#lib/env';
import { Events } from '#lib/types';
import { resetSpotifyToken } from '#utils/API';
import { minutes } from '@ruffpuff/utilities';

@ApplyOptions<Listener.Options>({ once: true })
export class UserListener extends Listener<Events.Ready> {
    private readonly style = this.isDev ? yellow : blue;

    public async run() {
        try {
            await Promise.all([this.initSpotify()]);
        } catch (error) {
            this.container.logger.fatal(error);
        }
        this.startLavalink();
        this.initAnalytics();
        this.printBanner();
        this.printStoreDebugInformation();
    }

    private startLavalink() {
        if (this.container.client.audio)
            setTimeout(async () => {
                await this.container.client.audio!.connect();
                await this.container.client.audio!.queues.start();
                this.container.logger.debug(`${blueBright('Lavalink:')} Successfully initialized.`);
            }, minutes(1));
    }

    private initAnalytics() {
        if (envParseBoolean('INFLUX_ENABLED')) {
            const { client } = this.container;

            const guildCount = client.guilds.cache.size;
            const userCount = client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0);

            client.emit(Events.AnalyticsSync, guildCount, userCount);

            this.container.logger.debug(`${blueBright('Analytics:')} Posted analytics, Users: ${userCount}. Guilds: ${guildCount}`);
        }
    }

    private async initSpotify() {
        await resetSpotifyToken();
    }

    private printBanner() {
        const success = green('+');
        const failed = red('-');
        const pad = ' '.repeat(5);

        const llc = this.isDev ? magentaBright : white;
        const blc = this.isDev ? magenta : blue;

        const line1 = llc(String.raw`            {`);
        const line2 = llc(String.raw`      {   }`);
        const line3 = llc(String.raw`       }_{ __{`);
        const line4 = llc(String.raw`    .-{   }   }-.`);
        const line5 = llc(String.raw`   (   }     {   )`);
        const line6 = llc(String.raw`   |"-.._____..-'|`);
        const line7 = llc(String.raw`   |             ;--.`);
        const line8 = llc(String.raw`   |            (__  \\`);
        const line9 = llc(String.raw`   |             | )  )`);
        const line10 = llc(String.raw`   |             |/  /`);
        const line11 = llc(String.raw`   |             /  /`);
        const line12 = llc(String.raw`   |            (  /`);
        const line13 = llc(String.raw`   \\             y'`);
        const line14 = llc(String.raw`    "-.._____..-'`);

        const name = String.raw`
${line1}      ,____
${line2}       /\  _ "\                    __
${line3}    \ \ \L\_\___   __  _  __  _/\_\    ____
${line4}  \ \  _\/ __"\/\ \/'\/\ \/'\/\ \  /'__"\
${line5}  \ \ \/\ \L\ \/>  </\/>  </\ \ \/\  __/
${line6}   \ \_\ \____//\_/\_\/\_/\_\\ \_\ \___"\
${line7} \/_/\/___/ \//\/_/\//\/_/ \/_/\/____/`;

        const row1 = `${pad}[${this.container.analytics ? success : failed}] Analytics`;
        const row2 = ` ${pad}[${envParseBoolean('AUDIO_ENABLED') ? success : failed}] Audio`;
        const row3 = ``;
        const row4 = ``;

        console.log(
            String.raw`
${name}
${line8} ${blc(`${process.env.VERSION_NUM}${this.isDev ? '-dev' : ''} ${process.env.VERSION_SIG}`.padStart(38, ' '))}
${line9} ${pad}[${success}] Gateway
${line10}  ${row1}
${line11}  ${row2}
${line12}  ${row3}
${line13}  ${row4}
${line14}       ${this.isDev ? `${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}`
        );
    }

    private printStoreDebugInformation() {
        const { client, logger, i18n } = this.container;
        const stores = [...client.stores.values()];
        const last = stores.pop()!;

        for (const store of stores) logger.info(this.styleStore(store));
        logger.info(gray(`├─ Loaded ${this.style(i18n.languages.size.toString().padEnd(3, ' '))} languages.`));
        logger.info(this.styleStore(last, true));
    }

    private styleStore(store: Store<any>, last = false) {
        return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
    }

    private get isDev() {
        return this.container.client.development;
    }
}
