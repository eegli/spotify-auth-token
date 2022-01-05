type OptionalConfig = {
  port: number;
  scopes: string;
  outFileName: string;
  outDir: string;
  show: boolean;
};

type RequiredConfig = {
  clientId: string;
  clientSecret: string;
};

export type UserConfig = RequiredConfig & Partial<OptionalConfig>;
export type AppConfig = RequiredConfig & OptionalConfig;

export type SpotifyTokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
  date_obtained: string;
};
