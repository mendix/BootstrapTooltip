const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const XMLPlugin = require("xml-webpack-plugin");
const ArchivePlugin = require("webpack-archive-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const fs = require("fs-extra");
const webpack = require("webpack");

/*
 * 'xml-webpack-plugin' & 'webpack-archive-plugin' causing some webpack deprecations warnigns.
 * These warnings are safe to be ignored as we're in webpack 4, consider to periodically check if these
 * dependencies can be updated especially before going to webpack 5.
 * Uncomment the line below to be able to trace webpack deprecations.
 * Set 'process.noDeprecation' to 'false' to get deprecations trace printed to your cmd/terminal.
 */
process.traceDeprecation = true;
process.noDeprecation = true;

const MODES = {
    DEV: "development",
    PROD: "production"
};

const isDev = process.env.MODE === MODES.DEV;

const widgetDir = `BootstrapTooltip/widget`;
const widgetUIDir = `${widgetDir}/ui`;

const widgetXMLFiles = [
    {
        template: "./src/package.xml",
        filename: "package.xml",
        data: {
            VERSION: process.env.npm_package_version
        }
    },
    {
        template: "./src/BootstrapTooltip.xml",
        filename: "BootstrapTooltip/BootstrapTooltip.xml"
    },
    {
        template: "./src/BootstrapTooltipContext.xml",
        filename: "BootstrapTooltip/BootstrapTooltipContext.xml"
    }
];

module.exports = {
    mode: isDev ? MODES.DEV : MODES.PROD,
    target: "web",
    devtool: isDev ? "eval-source-map" : false,
    entry: {
        BootstrapTooltipContext: "./src/BootstrapTooltipContext.js",
        BootstrapTooltip: "./src/BootstrapTooltip.js"
    },
    watch: isDev,
    watchOptions: {
        ignored: /node_modules/
    },
    output: {
        path: `${__dirname}/dist/BootstrapTooltip`,
        filename: `${widgetDir}/[name].js`,
        libraryTarget: "amd"
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-proposal-object-rest-spread"]
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer"),
                                require("postcss-clean"),
                                require("cssnano")({
                                    preset: [
                                        "default",
                                        {
                                            discardComments: {
                                                removeAll: true
                                            }
                                        }
                                    ]
                                })
                            ]
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: `[name].[ext]`,
                            outputPath: `${widgetUIDir}/images`
                        }
                    }
                ]
            },
            {
                test: /\.html$/i,
                use: "raw-loader"
            }
        ]
    },
    externals: [/mx|mxui|mendix|dijit|dojo|require/],
    plugins: _getPlugins()
};

function _getPlugins() {
    //ensure distDir for Archive Plugin
    fs.ensureDirSync("./dist");

    const plugins = [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `${widgetUIDir}/BootstrapTooltip.css`
        }),
        new XMLPlugin({
            files: widgetXMLFiles
        }),
        new ArchivePlugin({
            output: "./dist/BootstrapTooltip",
            format: "zip",
            ext: "mpk"
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ];

    const mxVersions = [6, 7, 8];
    mxVersions.forEach(version => {
        fs.ensureDirSync(`./test/mx-${version}/widgets`);
        plugins.push(
            new ArchivePlugin({
                output: `./test/mx-${version}/widgets/BootstrapTooltip`,
                format: "zip",
                ext: "mpk"
            })
        );
    });

    return plugins;
}
