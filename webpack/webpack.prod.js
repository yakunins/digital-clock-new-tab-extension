const { merge } = require("webpack-merge");
const chromeConfig = require("./webpack.chrome.js");
const firefoxConfig = require("./webpack.firefox.js");

const prodConfig = {
    mode: "production",
};

module.exports = [
    merge(chromeConfig, prodConfig),
    merge(firefoxConfig, prodConfig),
];
