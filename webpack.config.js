// Webpack uses this to work with directories
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');


// This is main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = (env, argv) => {

    const config = {
    // Path to your entry point. From this file Webpack will begin his work
    entry:  ['./assets/src/js/index.js', './assets/src/scss/style.scss'],

    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
        path: path.resolve(__dirname, 'assets/dist'),
        filename: 'development' === argv.mode ?  '[name].js' : '[name].min.js'
    },
    devtool: "source-map",
    module: {
        rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                        presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    // Apply rule for .sass, .scss or .css files
                    test: /\.(sa|sc|c)ss$/,
                    // Set loaders to transform files.
                    // Loaders are applying from right to left(!)
                    // The first loader will be applied after others
                    exclude: /(node_modules)/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            // This loader resolves url() and @imports inside CSS
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                            }
                        },
                        {
                            // Then we apply postCSS fixes like autoprefixer and minifying
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true,
                            }
                        }, 
                        {
                            // First we transform SASS to standard CSS
                            loader: "sass-loader",
                            options: {
                                implementation: require("sass"),
                                sourceMap: true,
                            }
                        }
                    ]
                },
                {
                    // Now we apply rule for images
                    test: /\.(png|jpe?g|gif|svg)$/,
                    use: [
                           {
                             // Using file-loader for these files
                             loader: "file-loader",
              
                             // In options we can set different things like format
                             // and directory to save
                             options: {
                               outputPath: './assets/build/img/'
                             }
                           }
                        ]
                }
                
            ]
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: 'development' === argv.mode ? "style.css" : "style.min.css",
                chunkFilename: '[id].css'
            }),
            new CopyPlugin([
                { from: './assets/src/img/', to: '../dist/img/' },
            ]),
        ]
    };

    return config;

}
