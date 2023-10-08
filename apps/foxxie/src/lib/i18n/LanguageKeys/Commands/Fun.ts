import { GetUserInfoResult } from '#api/LastFm';
import { DetailedDescription } from '#lib/types';
import { FT, T } from '@foxxie/i18n';

export const AnimalcrossingCoffee = FT<{ beans: string; milk: string; sugar: string }>('commands/fun:animalcrossingCoffee');
export const AnimalcrossingDetailedDescription = FT<{ prefix: string }, DetailedDescription>(
    'commands/fun:animalcrossingDetailedDescription'
);

export const AnimalcrossingFooter = T('commands/fun:animalcrossingFooter');
export const AnimalcrossingNoVillager = FT<{ villager: string }>('commands/fun:animalcrossingNoVillager');
export const AnimalcrossingNoVillagerProvided = T('commands/fun:animalcrossingNoVillagerProvided');
export const AnimalcrossingTitles = T<{
    birthday: string;
    catchphrase: string;
    coffee: string;
    game: string;
    gender: string;
    goal: string;
    personality: string;
    saying: string;
    series: string;
    siblings: string;
    skill: string;
    song: string;
    species: string;
    zodiac: string;
}>('commands/fun:animalcrossingTitles');

export const LastFmDetailedDescription = FT<{ prefix: string }, DetailedDescription>('commands/fun:lastFmDetailedDescription');
export const LastFmPlayListeners = FT<{ count: number }>('commands/fun:lastFmPlayListeners');
export const LastFmPlayNowPlaying = T('commands/fun:lastFmPlayNowPlaying');
export const LastFmPlayPlays = FT<{ count: number }>('commands/fun:lastFmPlayPlays');
export const LastFmPlayPlaysBy = FT<{ count: number; target: string }>('commands/fun:lastFmPlayPlaysBy');
export const LastFmPlayPlaysByYou = FT<{ count: number }>('commands/fun:lastFmPlayPlaysByYou');
export const LastFmPlayWasPlaying = T('commands/fun:lastFmPlayWasPlaying');
export const LastFmTitles = T<{
    statistics: string;
    summary: string;
}>('commands/fun:lastFmTitles');
export const LastFmTrackNotFoundForUser = FT<{ user: GetUserInfoResult['user'] }>('commands/fun:lastFmTrackNotFoundForUser');