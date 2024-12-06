import { FindOneOptions } from 'typeorm';
import { CustomRepository } from './CustomRepository.js';
import { ClientEntity } from '../entities/ClientEntity.js';

export class ClientRepository extends CustomRepository<ClientEntity> {
	public async ensure(options?: FindOneOptions<ClientEntity>): Promise<ClientEntity> {
		// eslint-disable-next-line @typescript-eslint/no-extra-parens
		const found = (await this.repository.findOne({ where: { id: process.env.CLIENT_ID, ...options } })) ?? new ClientEntity();
		return found;
	}
}
