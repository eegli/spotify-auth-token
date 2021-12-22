export declare type OptionalConfig = {
    port: number;
    scopes: string;
    outFileName: string;
    outDir: string;
};
declare type RequiredConfig = {
    client_id: string;
    client_secret: string;
};
export declare type CLIInputConfig = RequiredConfig & Partial<OptionalConfig>;
export declare type AppConfig = RequiredConfig & OptionalConfig;
export declare type SpotifyTokenResponse = {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
    refresh_token: string;
    scope: string;
    date_obtained: string;
};
export {};
