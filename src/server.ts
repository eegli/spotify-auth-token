import http from 'http';

export const createServerOnce = async (
  port: number,
  callback: () => unknown
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const server = http
      .createServer((req, res) => {
        res.end('You can now close this window');
        res.once('finish', () => {
          server.close();
          if (req.url) {
            resolve(req.url.slice(1));
          }
          reject("Couldn't get code or state");
        });
      })
      .listen(port, undefined, callback);
  });
};
