import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { container } from '@sapphire/pieces';
import { GuildEntity, ClientEntity, MemberEntity, StarEntity, ModerationEntity, ScheduleEntity } from './entities';
import { MongoDB } from './MongoDB';

export async function config(): Promise<void> {
    const connection = await createConnection({
        type: 'mongodb',
        host: 'local',
        url: process.env.MONGO_URL,
        port: 3306,
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
        entities: [ClientEntity, GuildEntity, MemberEntity, ModerationEntity, ScheduleEntity, StarEntity],
        authSource: 'admin',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        logging: true
    });

    container.db = new MongoDB(connection);
}
