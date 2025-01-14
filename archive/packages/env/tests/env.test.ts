import { BooleanString, EnvParse, IntegerString } from '../src';

process.env.STRING = 'string';
process.env.INT = '17';
process.env.BOOL = 'true';
process.env.ARRAY = 'one two three';
process.env.EXISTS = 'value';
process.env.NOTEXIST = '';

describe('env utils', () => {
    describe('string parsing', () => {
        test('GIVEN a string key, allow it to be resolved to a string', () => {
            const value = EnvParse.string('STRING');
            expect(value).toBe('string');
        });

        test('GIVEN an invalid string key, throws error', () => {
            // @ts-expect-error meant to throw an error
            expect(() => EnvParse.string('STRONG')).toThrowError();
        });
    });

    describe('integer parsing', () => {
        test('GIVEN a integer key, allow it to be resolved to an integer', () => {
            const value = EnvParse.int('INT');
            expect(value).toBe(17);
        });

        test('GIVEN an invalid integer key, throws error', () => {
            // @ts-expect-error meant to throw an error
            expect(() => EnvParse.int('IN')).toThrowError();
        });
    });

    describe('boolean parsing', () => {
        test('GIVEN a boolean key, allow it to be resolved to a boolean', () => {
            const value = EnvParse.boolean('BOOL');
            expect(value).toBe(true);
        });

        test('GIVEN an invalid boolean key, throws error', () => {
            // @ts-expect-error meant to throw an error
            expect(() => EnvParse.boolean('BOO')).toThrowError();
        });
    });

    describe('array parsing', () => {
        test('GIVEN an array key, allow it to be resolved to a array of strings', () => {
            const value = EnvParse.array('ARRAY');
            expect(value).toStrictEqual(['one', 'two', 'three']);
        });

        test('GIVEN an invalid array key, throws error', () => {
            // @ts-expect-error meant to throw an error
            expect(() => EnvParse.boolean('ARR')).toThrowError();
        });
    });

    describe('existence parsing', () => {
        test('GIVEN an existence key, allow it to be resolved to a boolean', () => {
            const value = EnvParse.exists('EXISTS');
            expect(value).toBe(true);
        });

        test('GIVEN an existence key and an invalid key, return false', () => {
            const value = EnvParse.exists('EXISTS', 'NOTEXIST');
            expect(value).toBe(false);
        });
    });
});

declare module '../src' {
    interface Env {
        STRING: string;
        INT: IntegerString;
        BOOL: BooleanString;
        ARRAY: string;
        EXISTS: string;
        NOTEXIST: string;
    }
}
