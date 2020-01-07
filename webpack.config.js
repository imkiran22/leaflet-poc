console.log('Running ' + process.env.NODE_ENV + ' scripts');
var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');

module.exports = {
    context: path.join(__dirname, "src"),
    devtool: debug ? "inline-sourcemap" : false,
    entry: ["babel-polyfill", "./js/main.js"],
    devServer: {
        historyApiFallback: true
    },
    module: {
        loaders: [{
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
                }
            }, {
                test: /\.(jpe?g|gif|eot|png|svg|woff|woff2|ttf|wav|mp3)$/,
                //exclude: /node_modules/,
                loader: "file-loader",
                options: {
                    name: '[path][name].[ext]',
                    //outputPath: '',
                    emitFile: true
                }
            },
            /*{
                  test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                  loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },*/
            {
                test: /\.css$/,
                loader: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                //exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            },
            {
                test: /\.json$/,
                loader: "file-loader",
                options: {
                    name: '[path][name].[ext]',
                    emitFile: true
                }
            }
        ]
    },
    output: {
        path: path.resolve(debug ? 'dist' : 'prod'),
        filename: "main.min.js"
    },
    plugins: debug ? [new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery'
    }), new HtmlWebpackPlugin({
        template: 'index.html',
        filename: 'index.html'
    }), new ExtractTextPlugin('[name].css', {
        allChunks: true
    }), new CopyWebpackPlugin([
        { from: 'json' }
    ])] : [
        // new webpack.optimize.DedupePlugin(),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            sourcemap: false
        }),
        new HtmlWebpackPlugin({
            hash: true,
            cache: false,
            template: 'index.html',
            filename: 'index.html',
            minify: {
                minifyJS: true,
                minifyCSS: true,
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new ExtractTextPlugin('[name].min.css', {
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),
        new CopyWebpackPlugin([
            { from: 'json' }
        ])
    ],
};