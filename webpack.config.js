const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const XMLPlugin = require("xml-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

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
    plugins: initPlugins()
};

function initPlugins() {
    const plugins = [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `${widgetUIDir}/BootstrapTooltip.css`
        }),
        new XMLPlugin({
            files: widgetXMLFiles
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ];

    initFileManagerPlugin(plugins);

    return plugins;
}

function initFileManagerPlugin(plugins) {
    const mxTestProjectVersions = [6, 7, 8];

    const mpkCopyCommands = mxTestProjectVersions.map(version => {
        return {
            source: "./dist/BootstrapTooltip.mpk",
            destination: `./test/mx-${version}/widgets/`
        };
    });

    const deploymentCopyCommands = mxTestProjectVersions.map(version => {
        return {
            source: "./dist/BootstrapTooltip/BootstrapTooltip/widget/",
            destination: `./test/mx-${version}/deployment/web/widgets/BootstrapTooltip/widget/`
        };
    });

    plugins.push(
        new FileManagerPlugin({
            onEnd: [
                {
                    archive: [
                        {
                            source: "./dist/BootstrapTooltip",
                            destination: "./dist/BootstrapTooltip.mpk"
                        }
                    ]
                },
                {
                    copy: mpkCopyCommands.concat(deploymentCopyCommands)
                }
            ]
        })
    );
}
