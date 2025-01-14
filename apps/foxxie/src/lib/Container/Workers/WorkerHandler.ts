import { AsyncQueue } from '@sapphire/async-queue';
import { container } from '@sapphire/pieces';
import { cyan, green, red, yellow } from 'colorette';
import { once } from 'node:events';
import { SHARE_ENV, Worker } from 'node:worker_threads';

import { IncomingPayload, OutgoingPayload, OutputType } from './types.js';
import { WorkerResponse } from './WorkerResponse.js';

export class WorkerHandler {
	public lastHeartBeat!: number;

	private id = 0;

	private online!: boolean;

	private queue = new AsyncQueue();

	private response = new WorkerResponse();

	private threadId = -1;

	private worker!: Worker;

	public constructor() {
		this.spawn();
	}

	public async send(data: Omit<IncomingPayload, 'id'>, delay: null | number = null) {
		await this.queue.wait();

		try {
			const id = this.generateId();
			this.worker.postMessage({ ...data, id });

			const promise = this.response.define(id);
			this.response.timeout(delay);

			return await promise;
		} catch (error) {
			await this.worker.terminate();
			await this.spawn().start();
			throw error;
		} finally {
			this.queue.shift();
		}
	}

	public spawn() {
		this.online = false;
		this.lastHeartBeat = 0;
		this.worker = new Worker(WorkerHandler.filename, { env: SHARE_ENV });
		this.worker.on('message', (message: OutgoingPayload) => this.handleMessage(message));
		this.worker.once('online', () => this.handleOnline());
		this.worker.once('exit', (code: number) => this.handleExit(code));
		return this;
	}

	public async start() {
		if (!this.online) await once(this.worker, 'online');
	}

	private generateId() {
		if (this.id === WorkerHandler.maximumId) {
			return (this.id = 0);
		}

		return this.id++;
	}

	private handleExit(code: number) {
		this.online = false;
		this.worker.removeAllListeners();

		/* istanbul ignore if: logs are disabled in tests */
		if (WorkerHandler.logsEnabled) {
			const worker = `[${yellow('W')}]`;
			const thread = cyan(this.threadId.toString(16));
			const exit = code === 0 ? green('0') : red(code.toString());
			container.logger.warn(`${worker} - Thread ${thread} closed with code ${exit}.`);
		}
	}

	private handleMessage(message: OutgoingPayload) {
		if (message.type === OutputType.Heartbeat) {
			this.lastHeartBeat = Date.now();
			return;
		}

		this.response.resolve(message.id, message);
	}

	private handleOnline() {
		this.online = true;
		this.threadId = this.worker.threadId;

		/* istanbul ignore if: logs are disabled in tests */
		if (WorkerHandler.logsEnabled) {
			const worker = `[${cyan('W')}]`;
			const thread = cyan(this.threadId.toString(16));
			container.logger.info(`${worker} - Thread ${thread} is now ready.`);
		}
	}

	public get remaining() {
		return this.queue.remaining;
	}

	private static readonly filename = new URL('worker.js', import.meta.url);
	private static readonly logsEnabled = process.env.NODE_ENV !== 'test';

	private static readonly maximumId = Number.MAX_SAFE_INTEGER;
}
