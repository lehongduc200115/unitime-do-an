import { Server } from '@hapi/hapi';
import pingController from '../ping.controller';

describe('ping.controller', () => {
  let server: Server;
  beforeAll(async () => {
    server = new Server();
    server.route(pingController);
  });

  it('should responds with success for ping', async () => {
    const options = {
      method: 'GET',
      url: `/ping`
    };

    const response = await server.inject(options);
    expect(response.statusCode).toEqual(200);
  });
});
