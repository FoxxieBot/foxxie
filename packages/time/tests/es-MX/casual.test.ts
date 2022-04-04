import { esMX } from '../../src';

describe('esMX casual', () => {
    test('WHEN given a string resolve it to a duration', () => {
        const str = 'este noche';
        const result = esMX.casual(str)!;

        expect(typeof result.duration).toBe('number');
    });

    test('WHEN given a string resolve it to a duration', () => {
        const str = 'a la medianoche';
        const result = esMX.duration(str, { mode: 'casual' })!;

        expect(typeof result).toBe('number');
    });

    test('WHEN given a string resolve it to a duration without mode', () => {
        const str = 'esta mañana';
        const result = esMX.duration(str)!;

        expect(typeof result).toBe('number');
    });

    test('WHEN given a string resolve it to a duration without mode', () => {
        const str = 'enero';
        const result = esMX.duration(str)!;

        expect(typeof result).toBe('number');
    });

    test('WHEN given an invalid string resolve it to null', () => {
        const str = 'enedhjjdro';
        const result = esMX.duration(str)!;

        expect(result).toBeNull();
    });

    test('WHEN given a string resolve it to a duration', () => {
        const morning = 'este mañana';
        const morningResult = esMX.casual(morning)!;

        const afternoon = 'este tarde';
        const afternoonResult = esMX.casual(afternoon)!;

        const noon = 'al mediodía';
        const noonResult = esMX.casual(noon)!;

        expect(typeof morningResult.duration).toBe('number');
        expect(typeof afternoonResult.duration).toBe('number');
        expect(typeof noonResult.duration).toBe('number');
    });

    test('WHEN unsuccessfully parsing a value, return null', () => {
        const str = 'estemedio';

        const resultMode = esMX.casual(str);
        const result = esMX.casual(str);

        expect(resultMode).toBeNull();
        expect(result).toBeNull();
    });
});