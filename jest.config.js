module.exports = {
    roots: ["src"],
    preset: "ts-jest",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: "tsconfig.test.json",
            },
        ],
    },
};
