const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );
const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
    ...defaultConfig,

    entry: {
        'editor' : path.resolve( process.cwd(), 'src/editor.js' ),
        'editor-styles': path.resolve( process.cwd(), 'src/editor-styles.css' ),
        'front': path.resolve( process.cwd(), 'src/front.js' ),
        'styles': path.resolve( process.cwd(), 'src/styles.css' ),
    },

    output: {
        filename: '[name].js',
        path: path.resolve( process.cwd(), 'build/' ),
    },

    plugins: [
        ...defaultConfig.plugins,

        new RemoveEmptyScriptsPlugin(),
    ],
};