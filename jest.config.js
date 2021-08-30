module.exports = {
    displayName: 'dom',
    testEnvironment: "jest-environment-jsdom",
    injectGlobals: true,
    setupFilesAfterEnv: ["./src/setupTests.ts"]
}