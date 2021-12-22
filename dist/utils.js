"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = exports.write = exports.read = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function read(path) {
    try {
        const data = (0, fs_1.readFileSync)(path, 'utf-8');
        return JSON.parse(data);
    }
    catch (e) {
        console.error(`Error: Cannot read file "${path}"`);
        process.exit(1);
    }
}
exports.read = read;
function write(path, fileName, data) {
    if (!(0, fs_1.existsSync)(path)) {
        (0, fs_1.mkdirSync)(path, { recursive: true });
    }
    path = (0, path_1.join)(path, fileName + '.json');
    (0, fs_1.writeFileSync)(path, JSON.stringify(data, null, 2));
}
exports.write = write;
function id() {
    return Math.random().toString(36).slice(2);
}
exports.id = id;
//# sourceMappingURL=utils.js.map