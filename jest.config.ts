
export default {

    bail: true,

    clearMocks: true,

    collectCoverage: true,

    collectCoverageFrom: ["<rootDir>/src/modules/**/useCases/**/*.ts"],

    coverageDirectory: "coverage",

    coverageProvider: "v8",

    coverageReporters: ["lcov", "text-summary"],

    preset: "ts-jest",
    testMatch: ["**/**.spec.ts"]
};
