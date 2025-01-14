import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { ClientAnalytics } from './ClientAnalytics';

@Entity('client', { schema: 'public' })
export class ClientEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn({ length: 19, default: process.env.CLIENT_ID })
    public id: string = process.env.CLIENT_ID as string;

    @Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
    public guildBlocklist: string[] = [];

    @Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
    public userBlocklist: string[] = [];

    @Column(() => ClientAnalytics)
    public analytics: ClientAnalytics;
}
