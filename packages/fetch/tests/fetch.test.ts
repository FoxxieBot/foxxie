import { fetch, HttpMethodEnum } from '../src';
import nock from 'nock';

describe('fetch', () => {
    let nockScopeHttps: nock.Scope;

    const errorStatusMessage = "Couldn't access file: The resource was not found";

    beforeAll(() => {
        nockScopeHttps = nock('https://cdn.ruffpuff.dev') //
            .persist()
            .get('/api')
            .times(Infinity)
            .reply(200, { test: true });
    });

    afterAll(() => {
        nockScopeHttps.persist(false);
        nock.restore();
    });

    describe('Http methods', () => {
        test('GIVEN an HttpMethodEnum.options, expect the method to be equal OPTIONS', () => {
            expect(HttpMethodEnum.Options).toBe('OPTIONS');
        });

        test('GIVEN an HttpMethodEnum.delete, expect the method to be equal DELETE', () => {
            expect(HttpMethodEnum.Delete).toBe('DELETE');
        });

        test('GIVEN an HttpMethodEnum.get, expect the method to be equal GET', () => {
            expect(HttpMethodEnum.Get).toBe('GET');
        });

        test('GIVEN an HttpMethodEnum.post, expect the method to be equal POST', () => {
            expect(HttpMethodEnum.Post).toBe('POST');
        });

        test('GIVEN an HttpMethodEnum.patch, expect the method to be equal PATCH', () => {
            expect(HttpMethodEnum.Patch).toBe('PATCH');
        });
    });

    describe('Error fetch', () => {
        test('GIVEN fetch w/ JSON response THEN returns JSON', async () => {
            const result = await fetch('https://cdn.ruffpuff.dev/api', HttpMethodEnum.Get) //
                .json<{ data: string }>();

            expect(result.data).toBe(errorStatusMessage);
        });
    });

    describe('Successful fetches', () => {
        test('GIVEN raw fetch for an image, return buffer', async () => {
            const result = await fetch('https://cdn.ruffpuff.dev/ruffpuff.jpg').raw();

            expect(result).toBeInstanceOf(Buffer);
        });

        test('GIVEN fetch for text, return a STRING', async () => {
            const result = await fetch('https://cdn.ruffpuff.dev').text();

            expect(typeof result).toBe('string');
        });

        describe('Fetches without content headers', () => {
            test('GIVEN fetch with json body EXPECT "sendDataAs" to be json', () => {
                const query = fetch('https://cdn.ruffpuff.dev') //
                    .body({
                        test: 'test'
                    }, 'json');

                expect(query.sendDataAs).toBe('json');
            })
        })
    });
});
