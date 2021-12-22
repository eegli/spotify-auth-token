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
exports.request = exports.getLocalhostUrl = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const getLocalhostUrl = (port) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const server = http_1.default
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
});
exports.getLocalhostUrl = getLocalhostUrl;
function request(opts, body) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const data = [];
            const req = https_1.default.request(opts, (res) => {
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
    });
}
exports.request = request;
//# sourceMappingURL=request.js.map