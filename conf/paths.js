const path = require("path");

module.exports = {
  srcDir: path.join(__dirname, "..", "src"),
  srcEntry: "./src/BootstrapTooltip.js",
  srcEntryContext: "./src/BootstrapTooltipContext.js",
  confDir: __dirname,
  distDir: path.join(__dirname, "..", "dist"),
  widgetPackageXML: path.join(__dirname, "..", "src", "package.ejs"),
  widgetConfigXMLWithContext: path.join(__dirname, "..", "src", "BootstrapTooltipContext.ejs"),
  widgetConfigXML: path.join(__dirname, "..", "src", "BootstrapTooltip.ejs")
};
