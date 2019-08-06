const paths = require("./paths");
const XMLPlugin = require("xml-webpack-plugin");
const ArchivePlugin = require("webpack-archive-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const {MxAppRootDir} = require("./vars");
const {widgetName, widgetNameWithContext, friendlyName, description, version} = require("../package.json");
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

const isProd = process.env.MODE === MODES.PROD;
const isDev = process.env.MODE === MODES.DEV;

const widgetDir = `${widgetName}/widget`;
const widgetUIDir = `${widgetDir}/ui`;

const generalXMLFilesConfigs = {
  NAME: widgetName,
  NAME_WITH_CONTEXT: widgetNameWithContext,
  VERSION: version
};

const widgetXMLFiles = [
  {
    template: paths.widgetPackageXML,
    filename: `package.xml`,
    data: {
      ...generalXMLFilesConfigs
    }
  },
  {
    template: paths.widgetConfigXML,
    filename: `${widgetName}/${widgetName}.xml`,
    data: {
      ...generalXMLFilesConfigs,
      FRIENDLY_NAME: friendlyName,
      WIDGET_DESC: description
    }
  },
  {
    template: paths.widgetConfigXMLWithContext,
    filename: `${widgetName}/${widgetNameWithContext}.xml`,
    data: {
      ...generalXMLFilesConfigs,
      FRIENDLY_NAME: friendlyName,
      WIDGET_DESC: description
    }
  }
];

module.exports = {
  mode: isDev ? MODES.DEV : MODES.PROD,
  target: "web",
  devtool: isDev ? "eval-source-map" : false,
  // devServer: devServerConfigs,
  entry: {BootstrapTooltipContext: paths.srcEntryContext, BootstrapTooltip: paths.srcEntryContext},
  watch: isDev,
  watchOptions: {
    ignored: /node_modules/
  },
  output: {
    path: paths.distDir,
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
          {loader: "postcss-loader", options: {config: {path: paths.confDir}}},
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
  //ensure distDir fir Archive Plugin
  fs.ensureDirSync(paths.distDir);
  const plugins = [
    new MiniCssExtractPlugin({
      filename: `${widgetUIDir}/${widgetName}.css`
    }),
    new XMLPlugin({
      files: widgetXMLFiles
    }),
    new ArchivePlugin({
      output: `${paths.distDir}/${widgetName}`,
      format: "zip",
      ext: "mpk"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ];

  if (MxAppRootDir) {
    plugins.push(
      new ArchivePlugin({
        output: `${MxAppRootDir}/widgets/${widgetName}`,
        format: "zip",
        ext: "mpk"
      })
    );
  }
  return plugins;
}
