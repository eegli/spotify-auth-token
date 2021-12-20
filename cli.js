#!/usr/bin/env node

const { cli } = require('./dist/index.js');

cli().catch(console.error);
