import fs from 'fs';
import http from 'http';
import registerHttpHandlers from '../../src/server/http';

const request = (url) => new Promise((resolve) => {
  http.get(url, (response) => {
    let data = '';
    response.on('data', (_data) => { (data += _data); });
    response.on('end', () => resolve(data));
  });
});

it('should respond with index.html', async () => {
  const httpServer = http.createServer();

  registerHttpHandlers(httpServer);

  await new Promise((resolve) => {
    httpServer.listen({ host: 'localhost', port: '1234' }, resolve);
  });

  const response = await request('http://localhost:1234');
  const expected = fs.readFileSync(`${__dirname}/../../index.html`).toString();

  expect(response).toEqual(expected);

  httpServer.close(() => httpServer.unref());
});
