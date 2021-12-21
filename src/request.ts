import http from 'http';
import https, { RequestOptions } from 'https';

export const getLocalhostUrl = async (port: number): Promise<string> => {
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
      .listen(port);
  });
};

export async function request<T>(
  opts: RequestOptions,
  body: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const data: Uint8Array[] = [];
    const req = https.request(opts, (res) => {
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        const resString = Buffer.concat(data).toString();
        resolve(JSON.parse(resString));
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(body);
    req.end();
  });
}
