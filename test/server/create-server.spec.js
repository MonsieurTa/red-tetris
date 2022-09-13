import createServer from '../../src/server';

it('should create a server', async () => {
  const { httpServer, serverSocket } = await createServer({
    host: 'localhost',
    port: '1234',
    runEngine: false,
  });

  expect(httpServer).not.toBeNull();
  expect(serverSocket).not.toBeNull();

  serverSocket.close();
  httpServer.close(() => httpServer.unref());
});
