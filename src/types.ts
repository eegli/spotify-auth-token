export type OptionalConfig = {
  port: number;
  scopes: string;
  outFileName: string;
  outDir: string;
};

export type RequiredConfig = {
  client_id: string;
  client_secret: string;
};

export type AuthConfig = RequiredConfig & Partial<OptionalConfig>;

export type SpotifyTokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
  date_obtained: string;
};
