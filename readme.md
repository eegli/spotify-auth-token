# Spotify Auth Token

![npm](https://img.shields.io/npm/v/spotify-auth-token) ![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/eegli/spotify-auth-token/ci-unit-tests/main) [![codecov](https://codecov.io/gh/eegli/spotify-auth-token/branch/main/graph/badge.svg?token=2GK6L7KXTD)](https://codecov.io/gh/eegli/spotify-auth-token)

### A simple and lightweight implementation of Spotify's Authorization Code Flow.

- CLI and programmatic use
- Customizable

Implements the authorization code flow according to the [Spotify docs](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/).

This helper was mainly developed to simplify my [Spotify history scrobbler](https://github.com/eegli/spotify-history).

## CLI Usage

The simplest way to get a token is via `npx` - no installation required.

```bash
npx spotify-auth-token@latest --clientId f40c6b --clientSecret 0199f38a
```

Optional arguments example:

```bash
npx spotify-auth-token@latest --clientId f40c6b --clientSecret 0199f38a --port 8000 --scopes "user-library-read"
```

With short flags:

```bash
npx spotify-auth-token@latest -ci f40c6b -cs 0199f38a -p 8000 -s "user-library-read user-top-read"
```

### Options

| Flag                      | **_(required?)_** Description                                                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-ci` \| `--clientId`     | ✅ Spotify client id                                                                                                                                           |
| `-cs` \| `--clientSecret` | ✅ Spotify client secret                                                                                                                                       |
| `-p` \| `--port`          | ❌ Port for localhost redirect url. Default: `3000`                                                                                                            |
| `-s` \| `--scopes`        | ❌ [Spotify auth scopes](https://developer.spotify.com/documentation/general/guides/authorization/scopes/), separated by a space. Default: `'user-read-email'` |
| `-o` \| `--outDir`        | ❌ Custom output directory relative to the current directory                                                                                                   |
| `-f` \| `--fileName`      | ❌ Custom file name for the token                                                                                                                              |

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

The options and defaults are the same as for the CLI plus `noEmit`. If
`noEmit` is set to `true`, the token will not be saved to the file
system.

```ts
type Options = {
  clientId: string;
  clientSecret: string;
  port?: number;
  scopes?: string;
  fileName?: string;
  outDir?: string;
  noEmit?: boolean;
};
```

### Examples

- CommonJS

```js
const { authorize } = require('spotify-auth-token/dist/authorize');

const token = await authorize({
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  port: 3000,
  scopes: 'user-read-email user-top-read',
  noEmit: true,
});
```

- ES Modules

```js
import authorize from 'spotify-auth-token';

const token = await authorize({
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  port: 3000,
  scopes: 'user-read-email user-top-read',
});
```

- TypeScript

```ts
import authorize, { UserConfig } from 'spotify-auth-token';

const config: UserConfig = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  port: 3000,
  scopes: 'user-read-email user-top-read',
};

const token = await authorize(config);
```
