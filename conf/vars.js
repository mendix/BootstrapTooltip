const path = require("path");
const fs = require("fs");

// define widget's default configs
let vars = {
  MxAppRootDir: false
};
const localConfigPath = path.join("..", "local.config.js");

if (fs.existsSync(path.join(__dirname, "..", "local.config.js"))) {
  const localConfigs = require(localConfigPath);
  // overwrite default configs with the local ones
  vars = {...vars, ...localConfigs};
}

module.exports = vars;
