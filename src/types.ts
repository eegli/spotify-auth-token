// Spotify credentials file
export type SpotifyCreds = {
  client_id: string;
  client_secret: string;
};

// Returned from Spotify
export type SpotifyToken = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
};

// For the local token server
export type SpotifyTokenResponse = Omit<SpotifyCreds, 'scopes'> & {
  state: string;
};
export type SpotifyTokenSuccess = Partial<SpotifyToken> & {
  dateObtained: string;
};

export type Config = Partial<SpotifyCreds> & {
  port: number;
  scopes: string;
};
