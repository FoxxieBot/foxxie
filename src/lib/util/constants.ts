import { execSync } from 'child_process';
import type { PostProcessorModule } from 'i18next';

export const rootFolder = process.cwd();

export const enum Colors {
    PokemonBird = 0x969696,
    Red = 0xff5c5c,
    Orange = 0xf79454,
    Yellow = 0xffdb5c,
    LemonYellow = 0xf1ab1d,
    Green = 0x5dba7d,
    Black = 0x737f8d,
    TheCornerStoreStarboard = 0xfff59f,
    BlurpleOld = 0x7289db,
    Blurple = 0x5865f2,
    Disboard = 0x25b8b8,
    Restricted = 1579292
}

export const enum BrandingColors {
    Primary = 0xed7c7d,
    Secondary = 0x4583c7
}

export const enum Schedules {
    Disboard = 'disboard',
    EndTempBan = 'endTempban',
    EndTempMute = 'endTempmute',
    EndTempNick = 'endTempnick',
    EndTempRestrictEmbed = 'endTemprestrictembed'
}

export const enum Urls {
    Disboard = 'https://disboard.org/',
    Haste = 'https://paste.ruffpuff.dev',
    Repo = 'https://github.com/Ruffpuff1/foxxie'
}

export const emojis = {
    success: '<:Check:916529451536363633>',
    error: '<:Cross:916529423430344754>',
    loading: '<a:HotCoffee:905458108225183765>',
    foxWiggle: '<a:foxwiggle:799197027568713748>',
    music: '🎶 🎻',
    perms: {
        granted: '<:PermsEnabled:894420447091904563>',
        notSpecified: '<:PermsUnspecified:894420872234942466>',
        denied: '<:PermsDisabled:894420679934484561>'
    },
    boosts: ['<a:boost1:904581076377292820>', '<a:boost2:904581123445776464>', '<a:boost3:904581171202097152>'],
    reactions: {
        no: '916529423430344754',
        yes: '916529451536363633'
    }
};

export const helpUsagePostProcessor: PostProcessorModule = {
    type: 'postProcessor',
    name: 'helpUsage',
    process(value, [key]) {
        // If the value is equal to the key then it is an empty usage, so return an empty string
        if (value === key) return '';
        // Otherwise just return the value
        return value;
    }
};

export const commit = () => {
    return execSync('git log -1 --date-order --format=format:"%h - %s"').toString().split('-');
};

export const allowedInviteIds = [
    // ID for `The Corner Store`, Foxxie's home server.
    '761512748898844702',
    /* Below are official Discord servers. DDevs, Testers, Townhall, DAPI, Demo Server, and Poker Night. */
    '613425648685547541',
    '197038439483310086',
    '169256939211980800',
    '81384788765712384',
    '670065151621332992',
    '831646372519346186',
    // Discord.JS server
    '222078108977594368',
    // Typescript Server
    '508357248330760243'
];
