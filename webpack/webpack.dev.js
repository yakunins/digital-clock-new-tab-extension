const { merge } = require("webpack-merge");
const chromeConfig = require("./webpack.chrome.js");
const firefoxConfig = require("./webpack.firefox.js");

const devConfig = {
    devtool: "inline-source-map",
    mode: "development",
};

module.exports = [
    merge(chromeConfig, devConfig),
    merge(firefoxConfig, devConfig),
];
