# Spotify Auth Token

### Simple, zero-dependency implementation of Spotify's Authorization Code Flow.

- CLI and programmatic use
- Lightweight
- TS support

Implements the authorization code flow according to the [Spotify docs](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/).

## CLI

The simplest way to get a token is via `npx` - no installation required.

```bash
npx spotify-auth-token --clientId f40c6b --clientSecret 0199f38a
```

### CLI options

| Flag           | Required                          | Description                     |
| -------------- | --------------------------------- | ------------------------------- |
| `clientId`     | ✅                                | Spotify client id               |
| `clientSecret` | ✅                                | Spotify client secret           |
| `port`         | ❌ - default: `3000`              | Port for localhost redirect url |
| `scopes`       | ❌ - default: `'user-read-email'` | Auth scopes                     |
| `outDir`       | ❌ - default: `process.cwd()`     | Custom output directory         |
| `outFileName`  | ❌ - default: `'spotify-token'`   | Custom file name for the token  |

## Programmatic use

Installation:

```bash
yarn add -D spotify-auth-token
```

or

```bash
npm install spotify-auth-token --save-dev
```

Same options as for CLI:

```ts
type Options = {
  clientId: string;
  clientSecret: string;
  port: number;
  scopes: string;
  outFileName: string;
  outDir: string;
};
```

Examples for vanilla JS and Typescript:

```js
const spotifyToken = require('spotify-auth-token');

const config = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  port: 3000,
  outDir: '',
  outFileName: 'spotify-token',
  scopes: 'user-read-email',
};

await spotifyToken(config);
```

```ts
import spotifyToken, { UserConfig } from 'spotify-auth-token';

const config: UserConfig = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  port: 3000,
  outDir: '',
  outFileName: 'spotify-token',
  scopes: 'user-read-email',
};

await spotifyToken(config);
```
