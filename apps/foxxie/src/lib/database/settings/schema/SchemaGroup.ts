import { codeBlock, isNullish, toTitleCase } from '@sapphire/utilities';
import { ISchemaValue, ReadonlyGuildData, SchemaKey } from '#lib/database';
import { AliasedCollection } from '#lib/database/settings/structures/collections/AliasedCollection';
import { FTFunction } from '#lib/types';

export type NonEmptyArray<T> = [T, ...T[]];

export class SchemaGroup extends AliasedCollection<string, SchemaGroup | SchemaKey> implements ISchemaValue {
	public readonly dashboardOnly = false;
	public readonly key: string;
	public readonly name: string;
	public readonly parent: null | SchemaGroup;
	public readonly type = 'Group';

	public constructor(key: string, name = 'Root', parent: null | SchemaGroup = null) {
		super();
		this.key = key;
		this.name = name;
		this.parent = parent;
	}

	public add([key, ...tail]: NonEmptyArray<string>, value: SchemaKey): SchemaGroup {
		if (tail.length === 0) {
			this.set(key, value);
			return this;
		}

		const previous = this.get(key);
		if (previous) {
			if (previous instanceof SchemaGroup) {
				return previous.add(tail as NonEmptyArray<string>, value);
			}

			throw new Error(`You cannot add '${key}' to a non-group entry.`);
		}

		const group = new SchemaGroup(key, `${this.name} / ${toTitleCase(key)}`, this);
		group.add(tail as NonEmptyArray<string>, value);
		this.set(key, group);
		return group;
	}

	public *childKeys() {
		for (const [key, entry] of this) {
			if (entry.type !== 'Group') yield key;
		}
	}

	public *childValues() {
		for (const entry of this.values()) {
			if (entry.type !== 'Group') yield entry;
		}
	}

	public display(settings: ReadonlyGuildData, language: FTFunction) {
		const folders: string[] = [];
		const sections = new Map<string, string[]>();
		let longest = 0;
		for (const [key, value] of this.entries()) {
			if (value.dashboardOnly) continue;
			if (value.type === 'Group') {
				folders.push(`// ${key}`);
			} else {
				const values = sections.get(value.type) ?? [];
				values.push(key);

				if (key.length > longest) longest = key.length;
				if (values.length === 1) sections.set(value.type, values);
			}
		}

		const array: string[] = [];
		if (folders.length) array.push('= Folders =', ...folders.sort(), '');
		if (sections.size) {
			for (const keyType of [...sections.keys()].sort()) {
				array.push(
					`= ${toTitleCase(keyType)}s =`,
					...sections
						.get(keyType)!
						.sort()
						.map((key) => `${key.padEnd(longest)} :: ${this.get(key)!.display(settings, language)}`),
					''
				);
			}
		}

		return codeBlock('asciidoc', array.join('\n'));
	}

	public getPathArray([key, ...tail]: NonEmptyArray<string>): null | SchemaGroup | SchemaKey {
		if (tail.length === 0) {
			return key === '' || key === '.' ? this : (this.get(key) ?? null);
		}

		const value = this.get(key);
		if (isNullish(value)) return null;
		if (value instanceof SchemaGroup) return value.getPathArray(tail as NonEmptyArray<string>);
		return null;
	}

	public getPathString(key: string): null | SchemaGroup | SchemaKey {
		return this.getPathArray(key.split('.') as NonEmptyArray<string>);
	}

	public override set(key: string, value: SchemaGroup | SchemaKey) {
		// Add auto-alias:
		if (key.includes('-')) {
			this.aliases.set(key.replaceAll('-', ''), value);
		}

		return super.set(key, value);
	}
}
