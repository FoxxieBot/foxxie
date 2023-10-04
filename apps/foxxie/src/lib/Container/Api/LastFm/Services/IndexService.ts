import { UserEntity } from '#lib/Database/entities/UserEntity';
import { years } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { blue } from 'colorette';
import { UpdateTypeBitField, UpdateTypeBits } from '../Enums/UpdateType';
import { ArtistRepository } from '../Repositories/ArtistRepository';
import { PlayRepository } from '../Repositories/PlayRepository';
import { UserRepository } from '../Repositories/UserRepository';
import { IndexedUserStats } from '../Structures/IndexedUserStats';
import { UserArtist } from '../Structures/UserArtist';
import { UserPlay } from '../Structures/UserPlay';

export class IndexService {
    public async modularUpdate(user: UserEntity, type: UpdateTypeBitField): Promise<IndexedUserStats> {
        container.logger.debug(`[${blue('Last.fm')}] Index: ${user.lastFm.username} / ${user.id} - Starting`);

        const stats = new IndexedUserStats();

        if (type.has(UpdateTypeBits.AllPlays) || type.has(UpdateTypeBits.Full)) {
            const plays = await this.getPlaysForUserFromLastFm(user);
            await PlayRepository.ReplaceAllPlays(plays, user.id);

            stats.playCount = plays.length;

            await UserRepository.SetUserIndexTime(user.id, plays);
        }

        if (type.has(UpdateTypeBits.Artist) || type.has(UpdateTypeBits.Full)) {
            const artists = await this.getTopArtistsForUser(user);

            await ArtistRepository.AddOrReplaceUserArtistsInDatabase(artists, user.id);
            stats.artistCount = artists.length;
        }

        return stats;
    }

    private async getTopArtistsForUser(user: UserEntity) {
        container.logger.debug(`[${blue('Last.fm')}] Getting artists for user ${user.lastFm.username}`);

        const indexLimit = 200;

        const topArtists = await this._dataSourceFactory.getTopArtists(user.lastFm.username!, undefined, 1000, indexLimit);

        if (!topArtists.success || !topArtists.content.topArtists) {
            return [] as UserArtist[];
        }

        return topArtists.content.topArtists.map(
            a =>
                new UserArtist({
                    name: a.artistName.toLowerCase(),
                    playcount: Number(a.userPlaycount),
                    userId: user.id
                })
        );
    }

    private async getPlaysForUserFromLastFm(user: UserEntity) {
        const pages = 750;

        const recentPlays = await this._dataSourceFactory.getRecentTracks(
            user.lastFm.username!,
            1000,
            undefined,
            undefined,
            undefined,
            pages
        );

        if (!recentPlays.success || !recentPlays.content.recentTracks.length) {
            return [] as UserPlay[];
        }

        const indexLimitFilter = Date.now() - years(2);
        const userPlays = [];

        const filtered = recentPlays.content.recentTracks
            .filter(w => !w.nowPlaying && w.timePlayed)
            .filter(w => true || w.timePlayed!.getTime() > indexLimitFilter);

        for (const track of filtered) {
            userPlays.push(
                new UserPlay({
                    track: track.trackName,
                    album: track.albumName,
                    artist: track.artistName,
                    timestamp: track.timePlayed!.getTime(),
                    userId: user.id
                })
            );
        }

        return userPlays;
    }

    private get _dataSourceFactory() {
        return container.apis.lastFm.dataSourceFactory;
    }
}