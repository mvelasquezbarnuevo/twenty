const net = require('net');

const listenPort = Number(process.env.PORT || 80);
const targetPort = 3000;

const connectUpstream = (client, attempt) => {
  const upstream = net.connect(targetPort, '127.0.0.1');

  upstream.once('connect', () => {
    client.pipe(upstream);
    upstream.pipe(client);
  });
  upstream.once('error', () => {
    upstream.destroy();
    if (client.destroyed || attempt >= 240) {
      client.destroy();
      return;
    }
    setTimeout(() => connectUpstream(client, attempt + 1), 1000);
  });
  client.once('close', () => upstream.destroy());
  client.once('error', () => upstream.destroy());
};

net
  .createServer((client) => {
    connectUpstream(client, 0);
  })
  .listen(listenPort);
