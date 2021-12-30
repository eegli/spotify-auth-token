# Spotify Auth Token

### Simple, zero-dependency implementation of Spotify's Authorization Code Flow.

- CLI and programmatic use
- Lightweight
- TS and ESM support

Implements the authorization code flow according to the [Spotify docs](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/).

This helper was mainly developed to simplify my [Spotify history scrobbler](https://github.com/eegli/spotify-history).

## CLI

The simplest way to get a token is via `npx` - no installation required.

```bash
npx spotify-auth-token@latest --clientId f40c6b --clientSecret 0199f38a
```

### CLI options

| Option           | Required                          | Description                                                                                             |
| ---------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `--clientId`     | ✅                                | Spotify client id                                                                                       |
| `--clientSecret` | ✅                                | Spotify client secret                                                                                   |
| `--port`         | ❌ - default: `3000`              | Port for localhost redirect url                                                                         |
| `--scopes`       | ❌ - default: `'user-read-email'` | [Spotify auth scopes](https://developer.spotify.com/documentation/general/guides/authorization/scopes/) |
| `--outDir`       | ❌ - default: `process.cwd()`     | Custom output directory relative to the current directory                                               |
| `--outFileName`  | ❌ - default: `'spotify-token'`   | Custom file name for the token                                                                          |

## Programmatic

### Installation

```bash
yarn add -D spotify-auth-token
```

or

```bash
npm install spotify-auth-token --save-dev
```

### Options

The options and defaults are the same as for the CLI:

```ts
type Options = {
  clientId: string;
  clientSecret: string;
  port?: number;
  scopes?: string;
  outFileName?: string;
  outDir?: string;
};
```

### Examples

- CommonJS (with JSDoc type hints)

```js
/** @type {import('spotify-auth-token').default} */
import authorize from 'spotify-auth-token';

authorize({
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  port: 3000,
  scopes: 'user-read-email',
});
```

- ES Modules

```js
import authorize from 'spotify-auth-token';

authorize({
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  port: 3000,
  scopes: 'user-read-email',
});
```

- TypeScript

```ts
import authorize, { UserConfig } from 'spotify-auth-token';

const config: UserConfig = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  port: 3000,
  scopes: 'user-read-email',
};

authorize(config);
```
