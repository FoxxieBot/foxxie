import { FT, T } from '#lib/types';

export const Ping = T('commands/general/ping:ping');
export const Pong = FT<{
	dbPing: number;
	roundTrip: number;
	wsPing: number;
}>('commands/general/ping:pong');
export const Description = T('commands/general/ping:description');
