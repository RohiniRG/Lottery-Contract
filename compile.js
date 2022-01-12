// Cross-platform compatible module to generate path between directories
const path = require('path');

// File system built-in package to read and write files
const fs = require('fs');

// Used to compile solidties files
const solc = require('solc');

// We need to create a path as we cannot directly require the .sol files as it will think it is a .js file
const inboxPath = path.resolve(__dirname, 'contracts', 'inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// JSON formatted input
const input = {
    language: 'Solidity',
    sources: {
        'Inbox.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

// JSON formatted output containing things under the key Inbox
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Inbox.sol'].Inbox;
