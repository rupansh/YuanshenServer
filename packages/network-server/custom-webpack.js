module.exports = function (config, _) {
    config.module.rules.push({
        test: /\.node$/,
        loader: "node-loader"
    })
    config.entry["worker"] = ["packages/network-server/src/app/game-server.worker.ts"];
    config.output["filename"] = "[name].js";

    return config;
};