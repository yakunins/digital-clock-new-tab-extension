module.exports = {
    roots: ["src"],
    preset: "ts-jest",
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    testPathIgnorePatterns: ["__mocks__"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: "tsconfig.test.json",
            },
        ],
    },
    moduleNameMapper: {
        "\\.css$": "<rootDir>/src/__tests__/__mocks__/styleMock.js",
    },
    transformIgnorePatterns: ["node_modules/(?!nanoid)"],
};
