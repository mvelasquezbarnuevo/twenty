const net = require('net');

const listenPort = Number(process.env.PORT || 80);
const targetPort = 3000;

net
  .createServer((client) => {
    const upstream = net.connect(targetPort, '127.0.0.1');
    const closeBoth = () => {
      client.destroy();
      upstream.destroy();
    };

    upstream.on('error', closeBoth);
    client.on('error', closeBoth);
    client.pipe(upstream);
    upstream.pipe(client);
  })
  .listen(listenPort);
