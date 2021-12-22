"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const request_1 = require("./request");
const utils_1 = require("./utils");
function run(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let config = {};
            if (opts) {
                config = Object.assign(config_1.defaultConfig, opts);
            }
            else {
                const usrConfigFilePath = process.argv[2];
                if (!usrConfigFilePath) {
                    console.error('Error: No credentials file specified');
                    process.exit(1);
                }
                const userConfig = (0, utils_1.read)(path_1.default.join(process.cwd(), usrConfigFilePath));
                if (!userConfig.client_id || !userConfig.client_secret) {
                    console.error('Error: Invalid config file');
                    process.exit(1);
                }
                config = Object.assign(config_1.defaultConfig, userConfig);
            }
            const redirectUri = `http://localhost:${config.port}`;
            const state = (0, utils_1.id)();
            const spotifyUrl = 'https://accounts.spotify.com/authorize?' +
                new URLSearchParams({
                    response_type: 'code',
                    show_dialog: 'true',
                    state: encodeURIComponent(state),
                    client_id: encodeURIComponent(config.client_id),
                    redirect_uri: redirectUri,
                    scope: encodeURIComponent(config.scopes),
                }).toString();
            console.info('Please click the link to login to Spotify in the browser\n');
            console.info(spotifyUrl + '\n');
            const authUrl = yield (0, request_1.getLocalhostUrl)(config.port);
            const params = new URLSearchParams(authUrl);
            const receivedCode = params.get('code');
            const receivedState = params.get('state');
            if (receivedState !== state) {
                throw new Error('Received and original state do not match');
            }
            if (!receivedCode) {
                console.error(receivedCode);
                throw new Error('No code received');
            }
            console.info('Login successfull!');
            const tokenRequestBody = new URLSearchParams({
                grant_type: 'authorization_code',
                code: receivedCode,
                redirect_uri: redirectUri,
            });
            const token = yield (0, request_1.request)({
                hostname: 'accounts.spotify.com',
                path: '/api/token',
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    Authorization: 'Basic ' +
                        Buffer.from(config.client_id + ':' + config.client_secret).toString('base64'),
                },
            }, tokenRequestBody.toString());
            token.date_obtained = new Date().toLocaleString();
            const outDir = path_1.default.join(process.cwd(), path_1.default.normalize(config.outDir));
            (0, utils_1.write)(outDir, config.outFileName, token);
            console.info('Saved Spotify access token');
            process.exit(0);
        }
        catch (e) {
            console.error('Something went wrong', e);
            process.exit(1);
        }
    });
}
exports.default = run;
//# sourceMappingURL=index.js.map