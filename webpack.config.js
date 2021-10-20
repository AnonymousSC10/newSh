const path = require('path')

module.exports = {
    entry: {
        'main': './src/main_front.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/static/js'),
    },
};