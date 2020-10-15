const path = require('path');

const SRC_DIR = path.resolve(__dirname, './');
const OUT_DIR = path.resolve(__dirname, 'build');

const config = {
    entry: {
        app: path.resolve(SRC_DIR, 'app.js')
    },
    // aws-sdk is already available in the Node.js Lambda environment
    //  so it should not be included in function bundles
    externals: [
        'aws-sdk'
    ],
    output: {
        path: OUT_DIR,
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd'
    },
    target: 'node'
};

module.exports = config;